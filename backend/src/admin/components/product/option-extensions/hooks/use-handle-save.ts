// types
import { OptionExtension } from "../../../../types/option-extension";
import { FileDTO } from "@medusajs/framework/types";

// ui
import { toast } from "@medusajs/ui";

// tanstack query client
import { useQueryClient } from "@tanstack/react-query";

// js sdk
import { sdk } from "../../../../lib/config";

type UseHandleSaveProps = {
  originalExtension: OptionExtension;
  updatedExtension: OptionExtension;
  hasChanged: () => boolean;
  hasOptionExtensionChanged: () => boolean;
  setSaving: (saving: boolean) => void;
  setOpen: (open: boolean) => void;
};

export const useHandleSave = ({
  originalExtension,
  updatedExtension,
  hasChanged,
  hasOptionExtensionChanged,
  setSaving,
  setOpen,
}: UseHandleSaveProps) => {
  // query client
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!hasChanged()) {
      toast.success("Option extension was successfully updated.");
      setOpen(false);
      return;
    }

    setSaving(true);

    try {
      if (hasOptionExtensionChanged()) {
        await sdk.client.fetch("/admin/product_option-extensions/option-extension", {
          method: "PUT",
          body: {
            id: updatedExtension.id,
            option_title: updatedExtension.option_title,
            display_type: updatedExtension.display_type,
            is_selected: updatedExtension.is_selected,
          },
        });
      }

      switch (updatedExtension.display_type) {
        case "buttons":
        case "dropdown":
          await Promise.all(
            updatedExtension.option_variations.map(async (variation) => {
              if (variation.option_image && "id" in variation.option_image) {
                await sdk.client.fetch(`/admin/upload`, {
                  method: "DELETE",
                  body: {
                    file_ids: [variation.option_image.file_id],
                  },
                });
              }

              await sdk.client.fetch("/admin/product_option-extensions/option-variation", {
                method: "PUT",
                body: {
                  id: variation.id,
                  variation_id: variation.variation_id,
                  color: null,
                  option_image: null,
                },
              });
            })
          );

          break;

        case "colors":
          await Promise.all(
            updatedExtension.option_variations.map(async (variation) => {
              if (variation.option_image && "id" in variation.option_image) {
                await sdk.client.fetch("/admin/upload", {
                  method: "DELETE",
                  body: {
                    file_ids: [variation.option_image.file_id],
                  },
                });
              }

              await sdk.client.fetch("/admin/product_option-extensions/option-variation", {
                method: "PUT",
                body: {
                  id: variation.id,
                  variation_id: variation.variation_id,
                  color: variation.color,
                  option_image: null,
                },
              });
            })
          );
          break;

        case "images":
          await Promise.all(
            updatedExtension.option_variations.map(async (variation, index) => {
              const originalVariation = originalExtension.option_variations[index];

              // check if the iamge has been replaced
              const isImageReplaced =
                originalVariation &&
                variation.option_image &&
                "temp_url" in variation.option_image &&
                originalVariation.option_image &&
                "id" in originalVariation.option_image;

              if (isImageReplaced && originalVariation.option_image && "id" in originalVariation.option_image) {
                await sdk.client.fetch("/admin/upload", {
                  method: "DELETE",
                  body: {
                    file_ids: [originalVariation.option_image.file_id],
                  },
                });
              }

              // Handle new image upload if a new image is present
              let result: FileDTO[] | null = null;
              if (variation.option_image && "temp_url" in variation.option_image) {
                const formData = new FormData();
                formData.append("files", variation.option_image.file);

                const res = await fetch(`/admin/upload`, {
                  method: "POST",
                  body: formData,
                  credentials: "include",
                });

                if (!res.ok) {
                  throw new Error("Failed to upload option image");
                }

                const { files } = (await res.json()) as { files: FileDTO[] };
                result = files;
              }

              await sdk.client.fetch("/admin/product_option-extensions/option-variation", {
                method: "PUT",
                body: {
                  id: variation.id,
                  variation_id: variation.variation_id,
                  color: null,
                  option_image:
                    variation.option_image && "temp_url" in variation.option_image && result
                      ? {
                          file_id: result[0].id,
                          name: variation.option_image.file.name,
                          size: variation.option_image.file.size,
                          mime_type: variation.option_image.file.type,
                          url: result[0].url,
                        }
                      : variation.option_image
                      ? variation.option_image
                      : null,
                },
              });
            })
          );
          break;
        default:
          throw new Error("Invalid display type");
      }

      toast.success("Option extension was successfully updated.");
    } catch (error) {
      toast.error("Failed to update option extension.");
      console.error("Error updating option extension", error);
    } finally {
      setSaving(false);
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["option-extensions", updatedExtension.product_id],
      });
    }
  };

  return { handleSave };
};
