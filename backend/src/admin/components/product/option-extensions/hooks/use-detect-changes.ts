import { OptionExtension, OptionVariationUnion } from "../../../../types/option-extension";

type UseDetectChangesProps = {
  originalExtension: OptionExtension | null;
  updatedExtension: OptionExtension | null;
};

export const useDetectChanges = ({ originalExtension, updatedExtension }: UseDetectChangesProps) => {
  const hasOptionExtensionChanged = (): boolean => {
    if (!updatedExtension || !originalExtension) {
      return false;
    }

    if (updatedExtension.display_type !== originalExtension.display_type) {
      return true;
    }

    if (updatedExtension.is_selected !== originalExtension.is_selected) {
      return true;
    }

    return false;
  };

  const hasOptionVariationChanged = (a: OptionVariationUnion, b: OptionVariationUnion) => {
    if (a.color !== b.color) {
      return true;
    }
    if (a.option_image !== b.option_image) {
      return true;
    }

    return false;
  };

  const hasChanged = (): boolean => {
    if (!updatedExtension || !originalExtension) return false;

    if (hasOptionExtensionChanged()) return true;

    for (let i = 0; i < updatedExtension.option_variations.length; i++) {
      if (hasOptionVariationChanged(updatedExtension.option_variations[i], originalExtension.option_variations[i])) {
        return true;
      }
    }

    return false;
  };

  return {
    hasOptionExtensionChanged,
    hasOptionVariationChanged,
    hasChanged,
  };
};
