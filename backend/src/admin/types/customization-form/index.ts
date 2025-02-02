export type CompleteImage = Exclude<Image, { temp_url: string }> | null;

export type Image =
  | {
      id: string | null;
      file_id: string;
      name: string;
      size: number;
      mime_type: string;
      url: string;
    }
  | {
      temp_url: string;
      file: File;
    };

export type Field = {
  id: string | null;
  uuid: string;
  display_type: "text" | "textarea" | "dropdown" | "image";
  label: string | null;
  description: string | null;
  placeholder: string | null;
  options: string[] | null;
  required: boolean;
  guide_image: Image | null;
};

export type Form = {
  id: string;
  product_id: string;
  name: string | null;
  active: boolean;
  fields: Field[];
};

// real types from medusa
import { InferTypeOf } from "@medusajs/framework/types";

import CustomizationForm from "../../../modules/customization-form/models/customization-form";
import CustomizationField from "../../../modules/customization-form/models/customization-field";
import GuideImage from "../../../modules/customization-form/models/guide-image";

export type CustomizationFormType = InferTypeOf<typeof CustomizationForm>;
export type CustomizationFieldType = InferTypeOf<typeof CustomizationField>;
export type GuideImageType = InferTypeOf<typeof GuideImage>;