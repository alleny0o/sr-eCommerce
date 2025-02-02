import { MedusaService } from "@medusajs/framework/utils";
import CustomizationForm from "./models/customization-form";
import CustomizationField from "./models/customization-field";
import GuideImage from "./models/guide-image";

class CustomizationFormModuleService extends MedusaService({
    CustomizationForm,
    CustomizationField,
    GuideImage,
}) {
};

export default CustomizationFormModuleService;