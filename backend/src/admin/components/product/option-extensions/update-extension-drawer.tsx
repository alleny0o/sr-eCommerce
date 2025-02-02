// types
import { OptionExtension } from "../../../types/option-extension";
import { AdminProductOptionValue } from "@medusajs/framework/types";

// hooks
import { useOptionExtension } from "./hooks/use-option-extension";
import { useDetectChanges } from "./hooks/use-detect-changes";
import { useUpdateExtension } from "./hooks/use-update-extension";
import { useHandleSave } from "./hooks/use-handle-save";

// query
import { useQuery } from "@tanstack/react-query";

//js sdk
import { sdk } from "../../../lib/config";

// ui
import { Badge, Button, Container, Label, Select, Switch, Text, Tooltip } from "@medusajs/ui";
import { CheckCircle, InformationCircle } from "@medusajs/icons";

// components
import { DrawerBase } from "./components/drawer-base";
import { Dropzone } from "./components/dropzone";
import { ColorPicker } from "./components/color-picker";
import { DrawerPrompt } from "./components/drawer-prompt";

type UpdateExtensionDrawerProps = {
  extension: OptionExtension;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const UpdateExtensionDrawer = ({ extension, open, setOpen }: UpdateExtensionDrawerProps) => {
  // use-option-extension
  const { originalExtension, updatedExtension, promptVisible, setPromptVisible, setUpdatedExtension, saving, setSaving } =
    useOptionExtension({
      extension,
    });

  // use-detect-changes
  const { hasOptionExtensionChanged, hasChanged } = useDetectChanges({
    originalExtension,
    updatedExtension,
  });

  // use-update-extension
  const { handleDisplayTypeChange, handleIsSelectedChange } = useUpdateExtension({
    updatedExtension,
    setUpdatedExtension,
  });

  // use-handle-save
  const { handleSave } = useHandleSave({
    originalExtension,
    updatedExtension,
    hasChanged,
    hasOptionExtensionChanged,
    setSaving,
    setOpen,
  });

  // handlers to manage interactions with the drawer
  const handleDrawerClose = () => {
    if (hasChanged()) {
      setPromptVisible(true);
    } else {
      setOpen(false);
    }
  };

  const confirmDiscardChanges = () => {
    setPromptVisible(false);
    setOpen(false);
    setUpdatedExtension(originalExtension);
  };

  const cancelDiscardChanges = () => {
    setPromptVisible(false);
  };

  // handler to obtain the
  const searchParams = new URLSearchParams();
  for (const variantion of updatedExtension.option_variations) {
    searchParams.append("ids[]", variantion.variation_id);
  }

  const {
    data: optionValues,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["option-values", searchParams.toString()],
    queryFn: async () =>
      sdk.client.fetch<{ values: AdminProductOptionValue[] }>(
        `/admin/product_option-extensions/option-values?${searchParams.toString()}`
      ),
  });

  if (isLoading) {
    return (
      <DrawerBase open={open} openChange={(open) => setOpen(!open)} heading="Edit Option Extension">
        <div className="size-full flex justify-center items-center">
          <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
        </div>
      </DrawerBase>
    );
  }

  if (error) {
    return (
      <DrawerBase open={open} openChange={(open) => setOpen(!open)} heading="Edit Option Extension">
        <div className="size-full flex justify-center items-center">
          <Badge color="red" size="base">
            ERROR: Couldn't load option values. Please reload the page.
          </Badge>
        </div>
      </DrawerBase>
    );
  }

  return (
    <>
      <DrawerBase
        open={open}
        openChange={() => {
          if (hasChanged()) {
            setPromptVisible(true);
          } else {
            setOpen(false);
          }
        }}
        heading="Edit Option Extension"
        footer={
          <>
            <Button size="small" variant="secondary" onClick={handleDrawerClose}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        {/* Option Title */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-x-1">
            <Label weight="plus" size="small">
              Option title
            </Label>
          </div>
          <div className="relative">
            <div className="cursor-not-allowed shadow-borders-base flex min-h-8 flex-wrap items-center gap-1 rounded-md px-2 py-1.5 transition-fg focus-within:shadow-borders-interactive-with-active has-[input:disabled]:bg-ui-bg-disabled has-[input:disabled]:text-ui-fg-disabled has-[input:disabled]:cursor-not-allowed bg-ui-bg-field hover:bg-ui-bg-field-hover">
              <span className="txt-compact-small">{updatedExtension.option_title}</span>
            </div>
          </div>
        </div>

        {/* Is Selected? */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-x-2">
            <Switch
              id="is-selected"
              checked={updatedExtension.is_selected}
              onClick={() => handleIsSelectedChange(!updatedExtension.is_selected)}
            />
            <Label weight="plus" size="small">
              Is this option selected by default?
            </Label>
          </div>
        </div>

        {/* Display Type */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-x-1">
            <Label weight="plus" size="small">
              Display type
            </Label>
          </div>
          <div>
            <Select value={updatedExtension.display_type} onValueChange={handleDisplayTypeChange}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value={"buttons"}>Buttons</Select.Item>
                <Select.Item value={"dropdown"}>Dropdown</Select.Item>
                <Select.Item value={"images"}>Images</Select.Item>
                <Select.Item value={"colors"}>Colors</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        {/* Edit Option Variations */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Label weight="plus" size="small">
              {updatedExtension.option_variations.length >= 1 ? "Edit Variations" : "No Variations to Edit"}
            </Label>
            <Tooltip content="When updating option variations for an option, first remove all existing variations before re-adding them. This ensures predictable ordering and accurate display on the storefront.">
              <InformationCircle />
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-y-3">
            {isSuccess ? (
              <>
                {updatedExtension.option_variations.map((variation, index) => {
                  const variationName = optionValues?.values.find((v) => v.id === variation.variation_id)?.value;

                  return (
                    <Container key={variation.id} className="items-start flex flex-col space-y-2 px-3 py-2">
                      <div className="inline-flex gap-x-1 items-center">
                        <Label size="xsmall">Variation value:</Label>
                        <Badge size="2xsmall" color="grey" className="inline-flex">
                          {variationName}
                        </Badge>
                      </div>

                      {/* If display type is buttons or dropdown */}
                      {(updatedExtension.display_type === "buttons" || updatedExtension.display_type === "dropdown") && (
                        <div className="flex items-center gap-x-1">
                          <Text size="xsmall" className="text-zinc-500 dark:text-zinc-400">
                            Nothing to edit for this display type
                          </Text>
                          <CheckCircle className="text-zinc-500 dark:text-zinc-400" />
                        </div>
                      )}

                      {/* If display type is colors */}
                      {updatedExtension.display_type === "colors" && (
                        <div className="flex items-center gap-x-1">
                          <ColorPicker
                            updatedOptionExtension={updatedExtension}
                            setUpdatedOptionExtension={setUpdatedExtension}
                            index={index}
                          />
                        </div>
                      )}

                      {/* If display type is images */}
                      {updatedExtension.display_type === "images" && (
                        <div className="inline-flex items-center gap-x-1">
                          <Dropzone
                            updatedOptionExtension={updatedExtension}
                            setUpdatedOptionExtension={setUpdatedExtension}
                            index={index}
                          />
                        </div>
                      )}
                    </Container>
                  );
                })}
              </>
            ) : (
              <>
                <Container className="flex justify-center items-center min-h-48">
                  <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
                </Container>
              </>
            )}
          </div>
        </div>
      </DrawerBase>

      {/* Prompt to confirm discard changes */}
      <DrawerPrompt open={promptVisible} onClose={cancelDiscardChanges} onConfirm={confirmDiscardChanges} />
    </>
  );
};
