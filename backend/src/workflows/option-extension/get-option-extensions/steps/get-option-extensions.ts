import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";

type GetOptionExtensionsStepInput = {
  product_id: string;
};

const getOptionExtensionsStep = createStep(
  "get-option-extensions-step",
  async (input: GetOptionExtensionsStepInput, { container }) => {
    const optionExtensionModuleService: OptionExtensionModuleService =
      container.resolve(OPTION_EXTENSION_MODULE);

    const option_extensions = await optionExtensionModuleService.listOptionExtensions(
      {
        product_id: input.product_id,
      },
      {
        relations: ["option_variations", "option_variations.option_image"],
        order: {
            created_at: "ASC",

            option_variations: {
                created_at: "ASC", 
            },
        }
      },
    );

    return new StepResponse(
      {
        option_extensions,
      },
    );
  }
);

export default getOptionExtensionsStep;