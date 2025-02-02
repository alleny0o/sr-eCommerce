// ui stuff
import { Label, Input } from "@medusajs/ui";

// form stuff
import { Controller } from "react-hook-form";

// context
import { useFieldContext } from "../../context/field-context";

export const FormFieldLabel = () => {
  const field = useFieldContext();

  return (
    <div className="flex flex-col gap-y-1">
      <Label size="small">Field Label</Label>
      <Controller
        name={`fields.${field.idx}.label`}
        control={field.form.control}
        render={({ field }) => {
          return (
            <div className="flex flex-col gap-y-1">
              <Input size="small" {...field} value={field.value || ""} placeholder="Enter field label..." />
            </div>
          );
        }}
      />
    </div>
  );
};
