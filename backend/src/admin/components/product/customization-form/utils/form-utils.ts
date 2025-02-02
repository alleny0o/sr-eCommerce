// types
import { Field } from "../../../../types/customization-form";

/**
 * Compares two guide_image objects to determine if they are identical.
 * @param imageA - The first guide_image object.
 * @param imageB - The second guide_image object.
 * @returns A boolean indicating whether the two guide_image objects are equal.
 */
export const compareGuideImages = (imageA: Field["guide_image"], imageB: Field["guide_image"]): boolean => {
  // Both null or undefined
  if (!imageA && !imageB) return true;

  // One is null or undefined, the other isn't
  if (!imageA || !imageB) return false;

  // Both have temp_url (newly uploaded images)
  if ("temp_url" in imageA && "temp_url" in imageB) {
    return imageA.temp_url === imageB.temp_url && imageA.file === imageB.file;
  }

  // Both have id (existing images)
  if ("id" in imageA && "id" in imageB) {
    return (
      imageA.id === imageB.id &&
      imageA.file_id === imageB.file_id &&
      imageA.name === imageB.name &&
      imageA.size === imageB.size &&
      imageA.mime_type === imageB.mime_type &&
      imageA.url === imageB.url
    );
  }

  // Mismatched types
  return false;
};
