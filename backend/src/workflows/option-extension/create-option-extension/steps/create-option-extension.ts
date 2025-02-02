import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";

type CreateOptionExtensionStepInput = {
    product_id: string;
    option_id: string;
    option_title: string;
};

const createOptionExtensionStep = createStep(
    'create-option-extension-step',
    async (input: CreateOptionExtensionStepInput, { container }) => {
        const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

        const optionExtension = await optionExtensionModuleService.createOptionExtensions({
            product_id: input.product_id,
            option_id: input.option_id,
            option_title: input.option_title,
            display_type: "buttons",
            is_selected: false,
        });

        return new StepResponse({
            option_extension: optionExtension,
        }, {
            option_extension: optionExtension,
        });
    },
    async ({ option_extension }: any, { container }) => {
        const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

        await optionExtensionModuleService.deleteOptionExtensions(option_extension.id);
    },
);

export default createOptionExtensionStep;