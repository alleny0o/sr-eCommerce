// types
import {
  OptionExtension,
  OptionExtensionButtonsOrDropdown,
  OptionExtensionColors,
  OptionExtensionImages,
  OptionExtensionType,
  OptionVariationType,
} from "../../../../types/option-extension";
import { AdminProductOption } from "@medusajs/framework/types";

// sets extensions state
export const setExtensionsUtil = (
  extensionData: { option_extensions: OptionExtensionType[] },
  setExtensions: (extensions: OptionExtension[]) => void
) => {
  const extensions: OptionExtension[] | [] = extensionData.option_extensions.map((oe: OptionExtensionType) => {
    switch (oe.display_type) {
      case "buttons":
      case "dropdown":
        return {
          id: oe.id,
          option_id: oe.option_id,
          product_id: oe.product_id,
          option_title: oe.option_title,
          display_type: oe.display_type,
          option_variations: oe.option_variations.map((ov: OptionVariationType) => ({
            id: ov.id,
            variation_id: ov.variation_id,
            color: null,
            option_image: null,
          })),
          is_selected: oe.is_selected,
        } as OptionExtensionButtonsOrDropdown;
      case "colors":
        return {
          id: oe.id,
          option_id: oe.option_id,
          product_id: oe.product_id,
          option_title: oe.option_title,
          display_type: oe.display_type,
          option_variations: oe.option_variations.map((ov: OptionVariationType) => ({
            id: ov.id,
            variation_id: ov.variation_id,
            color: ov.color || null,
            option_image: null,
          })),
          is_selected: oe.is_selected,
        } as OptionExtensionColors;
      case "images":
        return {
          id: oe.id,
          option_id: oe.option_id,
          product_id: oe.product_id,
          option_title: oe.option_title,
          display_type: oe.display_type,
          option_variations: oe.option_variations.map((ov: OptionVariationType) => ({
            id: ov.id,
            variation_id: ov.variation_id,
            color: null,
            option_image: ov.option_image
              ? {
                  id: ov.option_image.id,
                  file_id: ov.option_image.file_id,
                  name: ov.option_image.name,
                  size: ov.option_image.size,
                  mime_type: ov.option_image.mime_type,
                  url: ov.option_image.url,
                }
              : null,
          })),
          is_selected: oe.is_selected,
        } as OptionExtensionImages;
      default:
        throw new Error("Invalid display type");
    }
  });

  setExtensions(extensions);
};

// checks if options and extensions match
export const optionsMatch = (
  options: AdminProductOption[] | null,
  extensions: OptionExtension[]
): boolean => {
  if (!options && extensions.length === 0) {
    return true;
  }

  if (!options || extensions.length !== options.length) {
    return false;
  }

  return options.every(option => extensions.some(e => e.option_id === option.id));
};

// simply capitalize the first letter of a string
export const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
