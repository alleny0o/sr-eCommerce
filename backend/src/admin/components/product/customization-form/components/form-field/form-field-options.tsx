// context
import { useFieldContext } from "../../context/field-context";

// ui stuff
import { Label } from "@medusajs/ui";

// form stuff
import { Controller } from "react-hook-form";

// components
import TagInput from "../tag-input";

export const FormFieldOptions = () => {
  const field = useFieldContext();

  return (
    <div className="flex flex-col gap-y-2">
      <Label size="small">Field options (at least 1 recommended)</Label>
      <Controller
        name={`fields.${field.idx}.options`}
        control={field.form.control}
        render={() => (
          <>
            <TagInput
              name={`fields.${field.idx}.options`}
              control={field.form.control}
              placeholder="Type option and press comma or enter..."
            />
          </>
        )}
      />
    </div>
  );
};
