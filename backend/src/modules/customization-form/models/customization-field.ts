import { model } from "@medusajs/framework/utils";
import CustomizationForm from "./customization-form";
import GuideImage from "./guide-image";

const CustomizationField = model.define("customization_field", {
    id: model.id().primaryKey(),
    uuid: model.text().unique(),

    display_type: model.enum(["text", "textarea", "dropdown", "image"]),
    label: model.text().nullable(),
    description: model.text().nullable(),
    placeholder: model.text().nullable(),
    options: model.array().nullable(),
    required: model.boolean().default(false),

    guide_image: model.hasOne(() => GuideImage, {
        mappedBy: 'customization_field',
    }).nullable(),

    customization_form: model.belongsTo(() => CustomizationForm, {
        mappedBy: 'fields',
    }),
}).cascades({
    delete: ["guide_image"],
});

export default CustomizationField;