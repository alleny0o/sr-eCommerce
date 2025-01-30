// hooks/useEditMediaModal.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "@medusajs/ui";

// types
import { Media } from "../../../../types/medias";

// services
import { uploadMediaFiles, deleteMediaFiles, updateVariantMedias } from "../services/media-service";

export const useEditMediaModal = (variantId: string, productId: string, initialMedias: Media[], setMedias: (medias: Media[]) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedMedias, setEditedMedias] = useState<Media[]>([]);
  const [showConfirmPrompt, setShowConfirmPrompt] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedMedias(initialMedias);
    }
  }, [isOpen, initialMedias]);

  const areMediasEqual = useCallback((a: Media[], b: Media[]) => {
    if (a.length !== b.length) return false;
    return a.every((media, index) => media.file_id === b[index].file_id && media.is_thumbnail === b[index].is_thumbnail);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      if (areMediasEqual(initialMedias, editedMedias)) {
        toast.success("Media was successfully updated.");
        setIsOpen(false);
        return;
      }

      // Identify new files to upload
      const newFiles = editedMedias.filter((media) => media.file instanceof File);
      let uploadedMedias: Media[] = [];

      let finalMedias: Media[];

      if (newFiles.length > 0) {
        // Upload new files
        uploadedMedias = await uploadMediaFiles(
          newFiles.map((media) => media.file as File),
          variantId,
          productId,
        );

        // Reconstruct finalMedias preserving order
        finalMedias = [];
        let uploadIndex = 0;

        editedMedias.forEach((media) => {
          if (media.file instanceof File) {
            finalMedias.push(uploadedMedias[uploadIndex]);
            uploadIndex++;
          } else {
            finalMedias.push(media);
          }
        });
      } else {
        // No new files to upload; proceed with existing medias
        finalMedias = editedMedias;
      }

      // Determine medias to delete
      const newFileIds = new Set(finalMedias.map((m) => m.file_id));
      const deletedMedias = initialMedias.filter((m) => !newFileIds.has(m.file_id));

      // Delete removed medias if any
      if (deletedMedias.length > 0) {
        await deleteMediaFiles(deletedMedias.map((m) => m.file_id));
      }

      // Update variant medias on the server
      await updateVariantMedias(finalMedias, variantId);

      // Update the state with the new medias
      setMedias(finalMedias);
      toast.success("Media was successfully updated.");
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving medias:", error);
      toast.error("Failed to save medias :(");
    } finally {
      setIsSaving(false);
    }
  }, [areMediasEqual, initialMedias, editedMedias, setMedias, variantId]);

  const handleCancel = useCallback(() => {
    if (areMediasEqual(initialMedias, editedMedias)) {
      setIsOpen(false);
    } else {
      setShowConfirmPrompt(true);
    }
  }, [areMediasEqual, initialMedias, editedMedias]);

  const confirmCancel = useCallback(async () => {
    try {
      const savedFileIds = new Set(initialMedias.map((m) => m.file_id));
      const unsavedMedias = editedMedias.filter((m) => !savedFileIds.has(m.file_id));

      if (unsavedMedias.length > 0) {
        await deleteMediaFiles(unsavedMedias.map((m) => m.file_id));
      }
    } catch (error) {
      console.error("Error deleting medias:", error);
    }
    setShowConfirmPrompt(false);
    setEditedMedias(initialMedias);
    setIsOpen(false);
  }, [initialMedias, editedMedias]);

  const handleDelete = useCallback((file_id: string) => {
    setEditedMedias((medias) => medias.filter((media) => media.file_id !== file_id));
  }, []);

  const handleThumbnail = useCallback((file_id: string) => {
    setEditedMedias((medias) =>
      medias.map((media) => ({
        ...media,
        is_thumbnail: media.file_id === file_id,
      }))
    );
  }, []);

  return {
    isOpen,
    setIsOpen,
    editedMedias,
    setEditedMedias,
    showConfirmPrompt,
    setShowConfirmPrompt,
    isSaving,
    handleSave,
    handleCancel,
    confirmCancel,
    handleDelete,
    handleThumbnail,
    activeId,
    setActiveId,
  };
};
