import { model } from "@medusajs/framework/utils";
import CustomizationField from "./customization-field";

const CustomizationForm = model.define("customization_form", {
    id: model.id().primaryKey(),
    product_id: model.text().unique(),
    name: model.text().nullable(),
    active: model.boolean().default(false), 
    
    fields: model.hasMany(() => CustomizationField, {
        mappedBy: 'customization_form',
    }),
}).cascades({
    delete: ["fields"],
});

export default CustomizationForm;