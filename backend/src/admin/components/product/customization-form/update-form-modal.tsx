// ui
import { Button, FocusModal, Input, Label, Switch } from "@medusajs/ui";

// react-hook-form
import { Controller } from "react-hook-form";

// hooks
import { useCustomizationForm } from "./hooks/use-customization-form";

// types
import { Form } from "../../../types/customization-form";

// components
import { ModalPrompt } from "./components/modal-prompt";
import { LivePreview } from "./components/live-preview";
import { FormField } from "./components/form-field/form-field";
import { FieldContext } from "./context/field-context";

// props
type UpdateFormModalProps = {
  product_id: string;
  customizationForm: Form;
  focusModal: boolean;
  setFocusModal: (focusModal: boolean) => void;
};

export const UpdateFormModal = ({ product_id, customizationForm, focusModal, setFocusModal }: UpdateFormModalProps) => {
  const {
    form,
    fields,
    remove,
    handleAddField,
    handleCancel,
    handleReset,
    handleSave,
    promptVisible,
    setPromptVisible,
    saving,
    watch_fields,
  } = useCustomizationForm({
    customizationForm,
    product_id,
    onCloseModal: () => setFocusModal(false),
  });

  return (
    <>
      <FocusModal open={focusModal} onOpenChange={handleCancel}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center gap-x-2">
              <Button size="small" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="small" variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col overflow-hidden">
            <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
              {/* Form Fields Section */}
              <div className="bg-ui-bg-subtle size-full overflow-auto px-6 py-4 flex flex-col gap-y-6">
                {/* Is Form Active */}
                <div className="flex items-center gap-x-2">
                  <Label size="base" weight="plus">
                    Is Form Active
                  </Label>
                  <Controller
                    name="active"
                    control={form.control}
                    render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                  />
                </div>

                {/* Form Name */}
                <div className="flex flex-col gap-y-2">
                  <Label size="base" weight="plus">
                    Form Name
                  </Label>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => <Input {...field} value={field.value ?? ""} placeholder="Enter form name..." />}
                  />
                </div>

                {/* Manage Form Fields */}
                <div className="flex flex-col gap-y-2">
                  <Label size="base" weight="plus">
                    Manage Form Fields
                  </Label>
                  {fields.map((field, index) => (
                    <FieldContext.Provider
                      key={field.id}
                      value={{
                        idx: index,
                        remove: () => remove(index),
                        form,
                      }}
                    >
                      <FormField />
                    </FieldContext.Provider>
                  ))}
                  <Button variant="primary" size="small" onClick={handleAddField} disabled={fields.length >= 3}>
                    Add Field
                  </Button>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="bg-ui-bg-base overflow-y-auto overflow-x-hidden border-b px-6 py-4 lg:border-b-0 lg:border-l min-h-48">
                <div className="flex flex-col gap-y-6">
                  <Label weight="plus" size="base">
                    Live Preview
                  </Label>
                  <LivePreview fields={watch_fields} />
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Modal Prompt */}
      <ModalPrompt open={promptVisible} onClose={() => setPromptVisible(false)} onConfirm={handleReset} />
    </>
  );
};
