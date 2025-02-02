import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";
import { OptionVariation } from "..";

type CreateOptionVariationsStepInput = {
  option_extension_id: string;
  option_variations: OptionVariation[];
};

const createOptionVariationsStep = createStep(
  "create-option-variations-step",
  async (input: CreateOptionVariationsStepInput, { container }) => {
    const optionExtensionModuleService: OptionExtensionModuleService =
      container.resolve(OPTION_EXTENSION_MODULE);

    const optionVariations: {
      variation_id: string;
      option_extension_id: string;
    }[] = [];
    for (const variation of input.option_variations) {
      optionVariations.push({
        variation_id: variation.variation_id,
        option_extension_id: input.option_extension_id,
      });
    }

    let option_variations: any[] = [];
    if (optionVariations.length > 0) {
      option_variations =
        await optionExtensionModuleService.createOptionVariations(
          optionVariations
        );
    }

    return new StepResponse(
      {
        option_variations,
      },
      {
        option_variations_ids: option_variations.map((ov) => ov.id),
      }
    );
  },
  async ({ option_variations }: any, { container }) => {
    const optionExtensionModuleService: OptionExtensionModuleService =
      container.resolve(OPTION_EXTENSION_MODULE);

    await optionExtensionModuleService.deleteOptionVariations(
      option_variations
    );
  }
);

export default createOptionVariationsStep;
