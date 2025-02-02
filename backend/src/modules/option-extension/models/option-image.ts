import { model } from "@medusajs/framework/utils";
import OptionVariation from "./option-variation";

const OptionImage = model.define("option_image", {
  id: model.id().primaryKey(),
  file_id: model.text().unique(),
  name: model.text(),
  size: model.number(),
  mime_type: model.text(),
  url: model.text(),
  option_variation: model.belongsTo(() => OptionVariation, {
    mappedBy: "option_image",
  }),
});

export default OptionImage;
