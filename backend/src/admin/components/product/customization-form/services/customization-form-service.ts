// js sdk
import { sdk } from "../../../../lib/config";

// types
import { FileDTO } from "@medusajs/framework/types";
import { CustomizationFormType, Field } from "../../../../types/customization-form";

/**
 * Updates the customization form details.
 * @param formData - The form data containing id, name, and active status.
 * @returns The updated customization form.
 */
export const updateCustomizationFormDetails = async (formData: {
  id: string;
  name: string | null;
  active: boolean;
}): Promise<CustomizationFormType> => {
  const response = await sdk.client.fetch<{
    customization_form: CustomizationFormType;
  }>(`/admin/product_customization-form/form`, {
    method: "PUT",
    body: formData,
  });
  return response.customization_form;
};

/**
 * Uploads a file to the server.
 * @param file - The file to be uploaded.
 * @returns The uploaded file's details.
 */
export const uploadFile = async (file: File): Promise<FileDTO> => {
  const formData = new FormData();
  formData.append("files", file);

  const uploadResponse = await fetch("/admin/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result: { files: FileDTO[] } = await uploadResponse.json();
  return result.files[0];
};

/**
 * Deletes files from the server.
 * @param fileIds - An array of file IDs to be deleted.
 * @returns A promise indicating the completion of the delete operation.
 */
export const deleteFiles = async (fileIds: string[]): Promise<void> => {
  await sdk.client.fetch(`/admin/upload`, {
    method: "DELETE",
    body: { file_ids: fileIds },
  });
};

/**
 * Updates existing fields in the customization form.
 * @param fields - An array of fields to be updated.
 * @returns A promise indicating the completion of the update operation.
 */
export const updateFields = async (fields: Field[]): Promise<void> => {
  await sdk.client.fetch(`/admin/product_customization-form/fields`, {
    method: "PUT",
    body: { fields },
  });
};

/**
 * Creates new fields in the customization form.
 * @param fields - An array of new fields to be created.
 * @param productId - The product ID associated with the customization form.
 * @returns A promise indicating the completion of the create operation.
 */
export const createFields = async (fields: Field[], productId: string): Promise<void> => {
  await sdk.client.fetch(`/admin/product_customization-form/fields`, {
    method: "POST",
    body: {
      fields,
      product_id: productId,
    },
  });
};

/**
 * Deletes fields from the customization form.
 * @param fieldIds - An array of field IDs to be deleted.
 * @returns A promise indicating the completion of the delete operation.
 */
export const deleteFields = async (fieldIds: string[]): Promise<void> => {
  await sdk.client.fetch(`/admin/product_customization-form/fields`, {
    method: "DELETE",
    body: { field_ids: fieldIds },
  });
};
