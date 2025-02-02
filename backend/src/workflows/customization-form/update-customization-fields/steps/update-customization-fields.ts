import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";

export type UpdateCustomizationFieldsStepInput = {
  fields: {
    id: string;
    uuid: string;
    display_type: "text" | "textarea" | "dropdown" | "image";
    label: string | null;
    description: string | null;
    placeholder: string | null;
    options: string[] | null;
    required: boolean;
    guide_image: {
      id: string | null;
      file_id: string;
      name: string;
      size: number;
      mime_type: string;
      url: string;
    } | null;
  }[];
};

const updateCustomizationFieldsStep = createStep(
  "update-customization-fields-step",
  async (input: UpdateCustomizationFieldsStepInput, { container }) => {
    const customizationFormModuleService: CustomizationFormModuleService =
      container.resolve(CUSTOMIZATION_FORM_MODULE);
    const fieldsToUpdate = await customizationFormModuleService.listCustomizationFields(
      {
        id: input.fields.map((f) => f.id),
      },
      {
        relations: ["guide_image"],
      }
    );

    // Update fields
    await customizationFormModuleService.updateCustomizationFields(
      input.fields.map((f) => ({
        id: f.id,
        uuid: f.uuid,
        display_type: f.display_type,
        label: f.label,
        description: f.description,
        placeholder: f.placeholder,
        options: f.options,
        required: f.required,
      }))
    );

    for (const field of fieldsToUpdate) {
      const inputField = input.fields.find((f) => f.id === field.id);

      if (!inputField) {
        continue;
      }

      if (field.guide_image) {
        if (!inputField.guide_image) {
          await customizationFormModuleService.deleteGuideImages(field.guide_image.id);
        } else {
          await customizationFormModuleService.updateGuideImages({
            id: field.guide_image.id,
            file_id: inputField.guide_image.file_id,
            name: inputField.guide_image.name,
            size: inputField.guide_image.size,
            mime_type: inputField.guide_image.mime_type,
            url: inputField.guide_image.url,
            customization_field_id: field.id,
          });
        }
      } else {
        if (inputField.guide_image) {
          await customizationFormModuleService.createGuideImages({
            file_id: inputField.guide_image.file_id,
            name: inputField.guide_image.name,
            size: inputField.guide_image.size,
            mime_type: inputField.guide_image.mime_type,
            url: inputField.guide_image.url,
            customization_field_id: field.id,
          });
        }
      }
    }

    const updatedFields = await customizationFormModuleService.listCustomizationFields(
      {
        id: input.fields.map((f) => f.id),
      },
      {
        relations: ["guide_image"],
      }
    );

    return new StepResponse(
      {
        updated_fields: updatedFields,
      },
      {
        original_fields: fieldsToUpdate,
      }
    );
  },
  async ({ original_fields }: { original_fields: any[] }, { container }) => {
    const customizationFormModuleService: CustomizationFormModuleService =
      container.resolve(CUSTOMIZATION_FORM_MODULE);

    for (const originalField of original_fields) {
      // Restore field properties
      await customizationFormModuleService.updateCustomizationFields([
        {
          id: originalField.id,
          uuid: originalField.uuid,
          display_type: originalField.display_type,
          label: originalField.label,
          description: originalField.description,
          placeholder: originalField.placeholder,
          options: originalField.options,
          required: originalField.required,
        },
      ]);

      // Handle guide image restoration
      if (originalField.guide_image) {
        // If the guide image originally existed, ensure it is restored
        const existingImage = await customizationFormModuleService.retrieveGuideImage(
          originalField.guide_image.id
        );

        if (!existingImage) {
          // The guide image doesn't exist, create it
          await customizationFormModuleService.createGuideImages({
            file_id: originalField.guide_image.file_id,
            name: originalField.guide_image.name,
            size: originalField.guide_image.size,
            mime_type: originalField.guide_image.mime_type,
            url: originalField.guide_image.url,
            customization_field_id: originalField.id,
          });
        } else {
          // The guide image exists, update it to match the original state
          await customizationFormModuleService.updateGuideImages({
            id: originalField.guide_image.id,
            file_id: originalField.guide_image.file_id,
            name: originalField.guide_image.name,
            size: originalField.guide_image.size,
            mime_type: originalField.guide_image.mime_type,
            url: originalField.guide_image.url,
            customization_field_id: originalField.id,
          });
        }
      } else {
        // If the guide image didn’t originally exist, ensure it is deleted
        const currentField = await customizationFormModuleService.retrieveCustomizationField(
          originalField.id,
          { relations: ["guide_image"] }
        );

        if (currentField?.guide_image) {
          await customizationFormModuleService.deleteGuideImages(currentField.guide_image.id);
        }
      }
    }
  }
);

export default updateCustomizationFieldsStep;
