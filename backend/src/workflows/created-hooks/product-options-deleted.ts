import { deleteFilesWorkflow, deleteProductOptionsWorkflow } from "@medusajs/medusa/core-flows";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";
import OptionExtensionModuleService from "src/modules/option-extension/service";
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

deleteProductOptionsWorkflow.hooks.productOptionsDeleted(async ({ ids }, { container }) => {
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  // ----- OPTION EXTENSIONS -----
  const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);
  const option_extensions = await optionExtensionModuleService.listOptionExtensions(
    {
      option_id: ids,
    },
    {
      relations: ["option_variations", "option_variations.option_image"],
    }
  );

  if (!option_extensions) return;

  const file_ids: string[] = [];
  const option_extension_ids: string[] = [];
  const links: LinkDefinition[] = [];
  for (const option_extension of option_extensions) {
    option_extension_ids.push(option_extension.id);
    for (const option_variation of option_extension.option_variations) {
      if (option_variation.option_image && "file_id" in option_variation.option_image) {
        file_ids.push(option_variation.option_image.file_id);
      }
    }

    links.push({
      [Modules.PRODUCT]: {
        product_option_id: option_extension.option_id,
      },
      [OPTION_EXTENSION_MODULE]: {
        option_extension_id: option_extension.id,
      },
    });
  }

  // 1: delete files
  if (file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: file_ids,
      },
    });
  }

  // 2: delete option extensions
  await optionExtensionModuleService.deleteOptionExtensions(option_extension_ids);

  // 3: dismiss links
  await link.dismiss(links);
});
