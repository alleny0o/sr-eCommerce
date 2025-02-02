import { model } from "@medusajs/framework/utils";
import OptionVariation from "./option-variation";

const OptionExtension = model
  .define("option_extension", {
    id: model.id().primaryKey(),
    product_id: model.text(),
    option_id: model.text().unique(),
    option_title: model.text(),
    display_type: model.enum(["buttons", "dropdown", "colors", "images"]).default("buttons"),
    option_variations: model.hasMany(() => OptionVariation, {
      mappedBy: "option_extension",
    }),
    is_selected: model.boolean().default(false),
  })
  .cascades({
    delete: ["option_variations"],
  });

export default OptionExtension;
