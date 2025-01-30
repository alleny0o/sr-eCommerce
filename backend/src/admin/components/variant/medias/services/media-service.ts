// types
import { FileDTO } from "@medusajs/framework/types";
import { Media } from "../../../../types/medias";

// Uploads new media files to server
export const uploadMediaFiles = async (files: File[], variantId: string, productId: string): Promise<Media[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`/admin/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload media files");
  }

  const { files: uploadedFiles }: { files: FileDTO[] } = await response.json();

  if (uploadedFiles.length !== files.length) {
    throw new Error("Failed to upload all media files");
  }

  return uploadedFiles.map((file, index) => ({
    file_id: file.id,
    product_id: productId,
    variant_id: variantId,
    name: files[index].name,
    size: files[index].size,
    mime_type: files[index].type,
    is_thumbnail: false,
    url: file.url,
  }));
};

// Deletes media files from the server
export const deleteMediaFiles = async (fileIds: string[]): Promise<void> => {
  const response = await fetch(`/admin/upload`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_ids: fileIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete media files");
  }
};

// Updates variant medias on the server
export const updateVariantMedias = async (medias: Media[], variantId: string): Promise<void> => {
  // Remove existing medias
  const deleteRes = await fetch(`/admin/product-variant_medias/variant/${variantId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!deleteRes.ok) {
    throw new Error("Failed to delete existing variant medias");
  }

  // Add updated medias
  const createRes = await fetch("/admin/product-variant_medias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medias }),
  });

  if (!createRes.ok) {
    throw new Error("Failed to save updated variant medias");
  }
};
