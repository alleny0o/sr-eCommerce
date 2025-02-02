import { model } from "@medusajs/framework/utils";
import OptionImage from "./option-image";
import OptionExtension from "./option-extension";

const OptionVariation = model
  .define("option_variation", {
    id: model.id().primaryKey(),
    variation_id: model.text().unique(),
    color: model.text().nullable(),
    option_image: model
      .hasOne(() => OptionImage, {
        mappedBy: "option_variation",
      })
      .nullable(),

    option_extension: model.belongsTo(() => OptionExtension, {
      mappedBy: "option_variations",
    }),
  })
  .cascades({
    delete: ["option_image"],
  });

export default OptionVariation;
