import { model } from "@medusajs/framework/utils";
import CustomizationField from "./customization-field";

const GuideImage = model.define('guide_image', {
    id: model.id().primaryKey(),
    file_id: model.text().unique(),
    name: model.text(),
    size: model.number(),
    mime_type: model.text(),
    url: model.text(),

    customization_field: model.belongsTo(() => CustomizationField, {
        mappedBy: 'guide_image',
    }),
});

export default GuideImage;