import OptionExtensionModule from "../modules/option-extension";
import ProductModule from "@medusajs/medusa/product";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
    ProductModule.linkable.productOption,
    {
        linkable: OptionExtensionModule.linkable.optionExtension,
        deleteCascade: false,
    },
);