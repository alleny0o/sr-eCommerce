import CustomizationFormModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const CUSTOMIZATION_FORM_MODULE = "customizationFormModuleService";

export default Module(CUSTOMIZATION_FORM_MODULE, {
    service: CustomizationFormModuleService,
});