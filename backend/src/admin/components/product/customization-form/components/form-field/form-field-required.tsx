// context
import { useFieldContext } from "../../context/field-context";

// ui stuff
import { Label, Switch } from "@medusajs/ui";

// form stuff
import { Controller } from "react-hook-form";

export const FormFieldRequired = () => {
  const { form, idx } = useFieldContext();

  return (
    <div className="flex flex-col gap-y-2">
      <Controller
        name={`fields.${idx}.required`}
        control={form.control}
        render={({ field }) => (
          <div className="flex items-center gap-x-2">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <Label weight="regular" size="small">
              Is Required?
            </Label>
          </div>
        )}
      />
    </div>
  );
};
