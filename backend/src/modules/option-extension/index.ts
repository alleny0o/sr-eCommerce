import OptionExtensionModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const OPTION_EXTENSION_MODULE = "optionExtensionModuleService";

export default Module(OPTION_EXTENSION_MODULE, {
    service: OptionExtensionModuleService,
});