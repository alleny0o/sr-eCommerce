import { MedusaService } from "@medusajs/framework/utils";
import OptionExtension from "./models/option-extension";
import OptionVariation from "./models/option-variation";
import OptionImage from "./models/option-image";

class OptionExtensionModuleService extends MedusaService({
    OptionExtension,
    OptionVariation,
    OptionImage,
}) {
};

export default OptionExtensionModuleService;