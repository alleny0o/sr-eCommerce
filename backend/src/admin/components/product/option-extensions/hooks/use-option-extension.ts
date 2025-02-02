// types
import { OptionExtension } from "../../../../types/option-extension";

// react
import { useEffect, useState } from "react";

type UseOptionExtensionProps = {
  extension: OptionExtension;
};

export const useOptionExtension = ({ extension }: UseOptionExtensionProps) => {
  const [originalExtension, setOriginalExtension] = useState<OptionExtension>(extension);
  const [updatedExtension, setUpdatedExtension] = useState<OptionExtension>(extension);

  useEffect(() => {
    setOriginalExtension(extension);
    setUpdatedExtension(extension);
  }, [extension]);

  // prompt visible
  const [promptVisible, setPromptVisible] = useState<boolean>(false);

  // saving state
  const [saving, setSaving] = useState<boolean>(false);

  return {
    originalExtension,
    updatedExtension,
    setUpdatedExtension,
    promptVisible,
    setPromptVisible,
    saving,
    setSaving,
  };
};
