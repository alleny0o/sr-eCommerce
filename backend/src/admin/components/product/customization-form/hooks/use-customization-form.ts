// react
import { useState, useCallback } from "react";

// react-hook-form
import { useForm, useFieldArray, UseFormReturn, useWatch } from "react-hook-form";

// types
import { CompleteImage, Field, Form } from "../../../../types/customization-form";

// uuid
import { v4 as uuidv4 } from "uuid";

// utils
import { compareGuideImages } from "../utils/form-utils";

// useQuery 
import { useQueryClient } from "@tanstack/react-query";

import {
  updateCustomizationFormDetails,
  uploadFile,
  deleteFiles,
  updateFields,
  createFields,
  deleteFields,
} from "../services/customization-form-service";

// toast
import { toast } from "@medusajs/ui";

type UseCustomizationFormProps = {
  customizationForm: Form;
  product_id: string;
  onCloseModal: () => void;
};

export const useCustomizationForm = ({
  customizationForm,
  product_id,
  onCloseModal,
}: UseCustomizationFormProps) => {
  // query client
  const queryClient = useQueryClient();

  // initialize form with default values
  const form: UseFormReturn<Form> = useForm<Form>({
    defaultValues: customizationForm,
  });

  // manage dynamic form fields
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  // local states
  const [promptVisible, setPromptVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // watch fields
  const watch_fields = useWatch({ name: "fields", control: form.control });

  /**
   * Handler to add a new field to the form.
   */
  const handleAddField = useCallback(() => {
    append({
      id: null,
      uuid: uuidv4(),
      display_type: "text",
      label: null,
      description: null,
      placeholder: null,
      options: null,
      required: false,
      guide_image: null,
    });
  }, [append]);

  /**
   * Checks if the form's non-fields data has been modified.
   * @returns A boolean indicating if the form is dirty.
   */
  const isFormDirty = useCallback((): boolean => {
    return form.getValues("name") !== customizationForm.name || form.getValues("active") !== customizationForm.active;
  }, [form, customizationForm]);

  /**
   * Checks if the fields within the form have been modified.
   * @returns A boolean indicating if the fields are dirty.
   */
  const isFieldsDirty = useCallback((): boolean => {
    const currentFields = form.getValues("fields");

    // Check if the number of fields differs
    if (currentFields.length !== customizationForm.fields.length) return true;

    // Compare each field in detail
    for (let i = 0; i < currentFields.length; i++) {
      const field = currentFields[i];
      const originalField = customizationForm.fields[i];

      // Compare scalar and nullable properties
      if (
        field.display_type !== originalField.display_type ||
        field.label !== originalField.label ||
        field.description !== originalField.description ||
        field.placeholder !== originalField.placeholder ||
        field.required !== originalField.required
      ) {
        return true;
      }

      // Compare arrays (options)
      const optionsA = field.options || [];
      const optionsB = originalField.options || [];
      if (optionsA.length !== optionsB.length || !optionsA.every((opt, idx) => opt === optionsB[idx])) {
        return true;
      }

      // Compare guide_image using utility function
      if (!compareGuideImages(field.guide_image, originalField.guide_image)) {
        return true;
      }
    }

    return false; // No differences found
  }, [form, customizationForm]);

  /**
   * Handler to cancel the form editing.
   * If the form is dirty, prompt the user for confirmation.
   */
  const handleCancel = () => {
    if (isFormDirty() || isFieldsDirty()) {
      setPromptVisible(true);
    } else {
      onCloseModal();
    }
  }

  /**
   * Handler to reset the form when the user confirms cancellation.
   */
  const handleReset = useCallback(() => {
    form.reset(customizationForm);
    setPromptVisible(false);
    onCloseModal();
  }, [form, customizationForm, onCloseModal]);

  /**
   * Handles the save operation of the form.
   */
  const handleSave = useCallback(
    form.handleSubmit(async (formData) => {
      setSaving(true);

      try {
        if (!isFormDirty() && !isFieldsDirty()) {
          toast.success("Form was successfully updated.");
          return;
        }

        // updated form details if modified
        if (isFormDirty()) {
          await updateCustomizationFormDetails({
            id: formData.id,
            name: formData.name,
            active: formData.active,
          });
        }

        // updated fields if modified
        if (isFieldsDirty()) {
          const { fields: currentFields } = formData;
          const { fields: originalFields } = customizationForm;

          // identify deleted fields and their associated files
          const removedFields = originalFields.filter(
            (originalField) => !currentFields.some((currentField) => currentField.id === originalField.id)
          );
          const removedFieldIds = removedFields.map((field) => field.id).filter(Boolean) as string[];
          const removedFileIds = removedFields
            .map((field) => (field.guide_image && "id" in field.guide_image ? field.guide_image.file_id : null))
            .filter(Boolean) as string[];

          // handle updated fields
          const updatedFieldsPayload: Field[] = [];
          const oldFileIdsToDelete: string[] = [];
          for (const updatedField of currentFields.filter((field) => field.id)) {
            const matchingOriginalField = originalFields.find((originalField) => originalField.id === updatedField.id);
            if (!matchingOriginalField) continue;

            const { guide_image: originalGuideImage } = matchingOriginalField;
            let { guide_image: updatedGuideImage } = updatedField;

            // upload new image if necessary
            if (updatedGuideImage && "temp_url" in updatedGuideImage) {
              const uploadedFile = await uploadFile(updatedGuideImage.file);
              updatedGuideImage = {
                id: null,
                file_id: uploadedFile.id,
                name: updatedGuideImage.file.name,
                size: updatedGuideImage.file.size,
                mime_type: updatedGuideImage.file.type,
                url: uploadedFile.url,
              } as CompleteImage;

              // delete old file if necessary
              if (originalGuideImage && "id" in originalGuideImage) {
                oldFileIdsToDelete.push(originalGuideImage.file_id);
              }
            }

            updatedFieldsPayload.push({
              id: updatedField.id as string,
              uuid: updatedField.uuid,
              label: updatedField.label || null,
              description: updatedField.description || null,
              placeholder: updatedField.placeholder || null,
              required: updatedField.required,
              display_type: updatedField.display_type,
              options: updatedField.options || null,
              guide_image: updatedGuideImage as CompleteImage,
            });
          }

          // handle new fields
          const newFieldsPayload: Field[] = [];
          for (const newField of currentFields.filter((field) => !field.id)) {
            let { guide_image: newGuideImage } = newField;

            // Upload guide image if present
            if (newGuideImage && "temp_url" in newGuideImage) {
              const uploadedFile = await uploadFile(newGuideImage.file);
              newGuideImage = {
                id: null,
                file_id: uploadedFile.id,
                name: newGuideImage.file.name,
                size: newGuideImage.file.size,
                mime_type: newGuideImage.file.type,
                url: uploadedFile.url,
              } as CompleteImage;
            }

            newFieldsPayload.push({
              id: null,
              uuid: newField.uuid,
              label: newField.label || null,
              description: newField.description || null,
              placeholder: newField.placeholder || null,
              required: newField.required,
              display_type: newField.display_type,
              options: newField.options || null,
              guide_image: newGuideImage as CompleteImage,
            });
          }

          // prepare api requests
          const apiRequests: Promise<void>[] = [];

          if (removedFileIds.length > 0) {
            apiRequests.push(deleteFiles(removedFileIds));
          }

          if (removedFieldIds.length > 0) {
            apiRequests.push(deleteFields(removedFieldIds));
          }

          if (oldFileIdsToDelete.length > 0) {
            apiRequests.push(deleteFiles(oldFileIdsToDelete));
          }

          if (updatedFieldsPayload.length > 0) {
            apiRequests.push(updateFields(updatedFieldsPayload));
          }

          if (newFieldsPayload.length > 0) {
            apiRequests.push(createFields(newFieldsPayload, product_id));
          }

          // Execute all API requests concurrently
          await Promise.all(apiRequests);
        }

        toast.success("Form was successfully updated.");
        queryClient.invalidateQueries({ queryKey: ["customization-form", product_id] });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update form. Please try again.");
      } finally {
        setSaving(false);
        onCloseModal();
      }
    }),
    [form, isFormDirty, isFieldsDirty, customizationForm, product_id, onCloseModal]
  );

  return {
    form,
    fields,
    append,
    remove,
    handleAddField,
    handleCancel,
    handleReset,
    handleSave,
    promptVisible,
    setPromptVisible,
    saving,
    watch_fields,
  };
};
