// components
import { FormFieldDescription } from "./form-field-description";
import { FormFieldGuideImage } from "./form-field-guide-image";
import { FormFieldLabel } from "./form-field-label";
import { FormFieldOptions } from "./form-field-options";
import { FormFieldPlaceholder } from "./form-field-placeholder";
import { FormFieldRequired } from "./form-field-required";

type FormFieldDetailsProps = {
  displayType: "text" | "textarea" | "dropdown" | "image";
};

export const FormFieldDetails = ({ displayType }: FormFieldDetailsProps) => {
  return (
    <>
      <FormFieldLabel />
      <FormFieldDescription />
      {["text", "textarea", "dropdown"].includes(displayType) && <FormFieldPlaceholder />}
      {["dropdown"].includes(displayType) && <FormFieldOptions />}
      <FormFieldGuideImage />
      <FormFieldRequired />
    </>
  );
};
