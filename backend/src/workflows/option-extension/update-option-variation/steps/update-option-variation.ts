import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";

type OptionImage = {
  file_id: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
};

export type UpdateOptionVariationStepInput = {
  id: string;
  variation_id: string | null;
  color: string | null;
  option_image: OptionImage | null;
};

const updateOptionVariationStep = createStep(
  "update-option-variation-step",
  async (input: UpdateOptionVariationStepInput, { container }) => {
    const optionExtensionModuleService: OptionExtensionModuleService =
      container.resolve(OPTION_EXTENSION_MODULE);

    const option_variation =
      await optionExtensionModuleService.retrieveOptionVariation(input.id);

    const updated_option_variation =
      await optionExtensionModuleService.updateOptionVariations({
        id: input.id,
        variation_id: input.variation_id,
        color: input.color,
      });
    
    const old_option_image = await optionExtensionModuleService.listOptionImages({
      option_variation_id: updated_option_variation.id,
    });

    let created_option_image = null;
    if (input.option_image && old_option_image.length === 0) {
      created_option_image =
        await optionExtensionModuleService.createOptionImages({
          file_id: input.option_image.file_id,
          name: input.option_image.name,
          size: input.option_image.size,
          mime_type: input.option_image.mime_type,
          url: input.option_image.url,
          option_variation_id: updated_option_variation.id,
        });
    } else if (input.option_image && old_option_image.length > 0) {
      created_option_image =
        await optionExtensionModuleService.updateOptionImages({
          id: old_option_image[0].id,
          file_id: input.option_image.file_id,
          name: input.option_image.name,
          size: input.option_image.size,
          mime_type: input.option_image.mime_type,
          url: input.option_image.url,
        });
    };

    return new StepResponse({
        updated_option_variation: updated_option_variation,
    }, {
        option_variation: option_variation,
        created_option_image: created_option_image,
    });
  },
  async ({ option_variation, created_option_image }: any, { container }) => {
    const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);
    if (created_option_image) {
      await optionExtensionModuleService.deleteOptionImages(created_option_image.id);
    }

    await optionExtensionModuleService.updateOptionVariations({
      id: option_variation.id,
      variation_id: option_variation.variation_id,
      color: option_variation.color,
    });
  },
);

export default updateOptionVariationStep;
