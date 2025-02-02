// types
import { OptionExtension } from "../../../../types/option-extension";

type UseUpdateExtensionProps = {
  updatedExtension: OptionExtension;
  setUpdatedExtension: (extension: OptionExtension) => void;
};

export const useUpdateExtension = ({ updatedExtension, setUpdatedExtension }: UseUpdateExtensionProps) => {
  const handleDisplayTypeChange = (displayType: "buttons" | "dropdown" | "colors" | "images") => {
    setUpdatedExtension({
      ...updatedExtension,
      display_type: displayType,
    });
  };

  const handleIsSelectedChange = (isSelected: boolean) => {
      setUpdatedExtension({
        ...updatedExtension,
        is_selected: isSelected,
      });
  };

  return {
    handleDisplayTypeChange,
    handleIsSelectedChange,
  };
};
