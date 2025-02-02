import { deleteFilesWorkflow, updateProductOptionsWorkflow } from "@medusajs/medusa/core-flows";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";
import OptionExtensionModuleService from "src/modules/option-extension/service";

const areValuesEqual = (a: string[], b: string[]): boolean => {
  return a.length === b.length && a.every((value) => b.includes(value));
};

updateProductOptionsWorkflow.hooks.productOptionsUpdated(async ({ product_options }, { container }) => {
  // ----- OPTION EXTENSIONS -----
  const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);
  const option_extensions = await optionExtensionModuleService.listOptionExtensions(
    {
      option_id: product_options.map((option) => option.id),
    },
    {
      relations: ["option_variations", "option_variations.option_image"],
    }
  );

  for (const option_extension of option_extensions) {
    const associated_option = product_options.find((o) => o.id === option_extension.option_id);
    if (!associated_option) continue;
    const option_variation_ids = option_extension.option_variations.map((v) => v.variation_id);
    const option_value_ids = associated_option.values.map((v) => v.id);

    if (!areValuesEqual(option_variation_ids, option_value_ids)) {
      const file_ids: string[] = [];
      const ids: string[] = [];
      for (const option_variation of option_extension.option_variations) {
        if (option_variation.option_image && "file_id" in option_variation.option_image) {
          file_ids.push(option_variation.option_image.file_id);
        }
        ids.push(option_variation.id);
      }

      // 1: Delete variations
      await optionExtensionModuleService.deleteOptionVariations(ids);

      // 2: Delete associated images
      if (file_ids.length > 0) {
        await deleteFilesWorkflow(container).run({
          input: {
            ids: file_ids,
          },
        });
      }

      // 3: Recreate variations
      for (const value of associated_option.values) {
        await optionExtensionModuleService.createOptionVariations({
          option_extension_id: option_extension.id,
          variation_id: value.id,
        });
      }
    }

    // 4: Update option extension title if it differs from the product option title
    if (option_extension.option_title !== associated_option.title) {
      await optionExtensionModuleService.updateOptionExtensions({
        id: option_extension.id,
        option_title: associated_option.title,
      });
    }
  }
});
