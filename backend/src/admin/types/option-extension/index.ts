// OPTION EXTENSION TYPES
export type OptionImage =
  | {
      id: string;
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

export type OptionVariationBase = {
  id: string;
  variation_id: string;
};

export type OptionVariationButtonsOrDropdown = OptionVariationBase & {
  color: null;
  option_image: null;
};

export type OptionVariationImages = OptionVariationBase & {
  color: null;
  option_image: OptionImage | null;
};

export type OptionVariationColors = OptionVariationBase & {
  color: string | null;
  option_image: null;
};

export type OptionVariation = OptionVariationBase & {
  color: string | null;
  option_image: OptionImage | Express.Multer.File | null;
};

export type OptionExtension =
  | {
      id: string;
      option_id: string;
      product_id: string;
      option_title: string;
      display_type: "buttons" | "dropdown";
      option_variations: OptionVariationButtonsOrDropdown[];
      is_selected: boolean;
    }
  | {
      id: string;
      option_id: string;
      product_id: string;
      option_title: string;
      display_type: "images";
      option_variations: OptionVariationImages[];
      is_selected: boolean;
    }
  | {
      id: string;
      option_id: string;
      product_id: string;
      option_title: string;
      display_type: "colors";
      option_variations: OptionVariationColors[];
      is_selected: boolean;
    }
  | {
      id: string;
      option_id: string;
      product_id: string;
      option_title: string;
      display_type: "buttons" | "dropdown" | "colors" | "images";
      option_variations: OptionVariation[];
      is_selected: boolean;
    };

export type OptionExtensionButtonsOrDropdown = Extract<OptionExtension, { display_type: "buttons" | "dropdown" }>;
export type OptionExtensionImages = Extract<OptionExtension, { display_type: "images" }>;
export type OptionExtensionColors = Extract<OptionExtension, { display_type: "colors" }>;

export type OptionVariationUnion =
  | OptionVariationButtonsOrDropdown
  | OptionVariationImages
  | OptionVariationColors
  | OptionVariation;

import { InferTypeOf } from "@medusajs/framework/types";
import OptionExtension from "../../../modules/option-extension/models/option-extension";
import OptionVariation from "../../../modules/option-extension/models/option-variation";

export type OptionExtensionType = InferTypeOf<typeof OptionExtension>;
export type OptionVariationType = InferTypeOf<typeof OptionVariation>;

export type VariationDetails = {
  variation_id: string;
  variation_value: string;
};
