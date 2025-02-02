// context
import { useFieldContext } from "../../context/field-context";

// ui stuff
import { Label } from "@medusajs/ui";

// Components
import Dropzone from "../dropzone";

export const FormFieldGuideImage = () => {
  const { form, idx } = useFieldContext();

  return (
    <div className="flex flex-col gap-y-1">
      <Label size="small">Guide Image</Label>
      <Dropzone form={form} value={`fields.${idx}.guide_image`} />
    </div>
  );
};
