import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";
import { MedusaError } from "@medusajs/framework/utils";

type UpdateOptionExtensionStepInput = {
  id: string;
  option_title?: string;
  display_type?: "buttons" | "dropdown" | "colors" | "images";
  is_selected?: boolean;
};

const updateOptionExtensionStep = createStep(
    'update-option-extension-step',
    async (input: UpdateOptionExtensionStepInput, { container }) => {
        const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

        const option_extension = await optionExtensionModuleService.retrieveOptionExtension(input.id);
        if (!option_extension) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Option extension with id ${input.id} was not found`
              );
        };

        const updatePayload: Partial<UpdateOptionExtensionStepInput> = {};
        if (input.option_title) updatePayload.option_title = input.option_title;
        if (input.display_type) updatePayload.display_type = input.display_type;
        if (typeof input.is_selected !== "undefined") updatePayload.is_selected = input.is_selected;

        const new_option_extension = await optionExtensionModuleService.updateOptionExtensions({
            id: input.id,
            ...updatePayload,
        });

        return new StepResponse(
            {
                option_extension: new_option_extension,
            }, 
            {
                option_extension: option_extension,
            },
        );
    },
    async ({ option_extension }: any, { container }) => {
        const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

        await optionExtensionModuleService.updateOptionExtensions({
            id: option_extension.id,
            option_title: option_extension.option_title,
            display_type: option_extension.display_type,
            is_selected: option_extension.is_selected,
        });
    },
);

export default updateOptionExtensionStep;