import CustomizationFormModule from "../modules/customization-form";
import ProductModule from "@medusajs/medusa/product";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
    ProductModule.linkable.product,
    {
        linkable: CustomizationFormModule.linkable.customizationForm,
        deleteCascade: false,
    },
);