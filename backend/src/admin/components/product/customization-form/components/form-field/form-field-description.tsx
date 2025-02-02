// context
import { useFieldContext } from "../../context/field-context";

// ui stuff
import { Label, Textarea } from "@medusajs/ui";

// form stuff
import { Controller } from "react-hook-form";

export const FormFieldDescription = () => {
  const field = useFieldContext();
  return (
    <div className="flex flex-col gap-y-1">
      <Label size="small">Field Description (optional)</Label>
      <Controller
        name={`fields.${field.idx}.description`}
        control={field.form.control}
        render={({ field }) => (
          <Textarea {...field} value={field.value || ""} placeholder="Enter field description..." />
        )}
      />
    </div>
  );
};
