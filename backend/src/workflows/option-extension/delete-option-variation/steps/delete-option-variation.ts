import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";

export type DeleteOptionVariationStepInput = {
    id: string;
};

const deleteOptionVariationStep = createStep(
    "delete-option-variation-step",
    async (input: DeleteOptionVariationStepInput, { container }) => {
        const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

        const option_extension = await optionExtensionModuleService.retrieveOptionVariation(input.id);

        await optionExtensionModuleService.deleteOptionVariations(input.id);

        return new StepResponse({
            option_extension: option_extension,
        }, {
            option_extension: option_extension,
        });
    },
    async ({ option_extension }: any, { container }) => {
        const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

        await optionExtensionModuleService.createOptionVariations(option_extension);
    },
);

export default deleteOptionVariationStep;
