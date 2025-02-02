// Core Flows
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

// Services
import VariantMediaModuleService from "src/modules/variant-media/service";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import OptionExtensionModuleService from "src/modules/option-extension/service";

// Module Definitions
import { VARIANT_MEDIA_MODULE } from "src/modules/variant-media";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";

// Workflows
import deleteVariantMediasWorkflow from "../variant-media/delete-variant-medias";

// Framework Utilities
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// Registering hook for when products are deleted
deleteProductsWorkflow.hooks.productsDeleted(async ({ ids }, { container }) => {
  // Resolve services and utilities
  const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  /* ----- VARIANT MEDIA ----- */
  // Fetch variant media associated with the deleted products
  const medias = await variantMediaModuleService.listVariantMedias({
    product_id: ids,
  });

  // Prepare IDs and link definitions for cleanup
  const file_ids: string[] = [];
  const media_ids: string[] = [];
  const media_links: LinkDefinition[] = [];
  for (const media of medias) {
    file_ids.push(media.file_id); // Collect file IDs for deletion
    media_ids.push(media.id); // Collect media IDs for deletion
    media_links.push({
      [Modules.PRODUCT]: {
        product_variant_id: media.variant_id,
      },
      [VARIANT_MEDIA_MODULE]: {
        variant_media_id: media.id,
      },
    }); // Prepare link definitions
  }

  // 1: Delete associated files if any exist
  if (file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: file_ids,
      },
    });
  }

  // 2: Delete associated media records if any exist
  if (media_ids.length > 0) {
    await deleteVariantMediasWorkflow(container).run({
      input: {
        media_ids: media_ids,
      },
    });
  }

  // 3: Dismiss associated links if any exist
  if (media_links.length > 0) {
    await link.dismiss(media_links);
  }

  /* ----- CUSTOMIZATION FORM ----- */
  const customizationFormModuleService: CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);

  const customization_forms = await customizationFormModuleService.listCustomizationForms(
    {
      product_id: ids,
    },
    {
      relations: ["fields", "fields.guide_image"],
    }
  );

  const form_file_ids: string[] = [];
  const customization_form_ids: string[] = [];
  for (const customization_form of customization_forms) {
    if (!customization_form) continue;

    customization_form_ids.push(customization_form.id);

    for (const customization_field of customization_form.fields) {
      if (customization_field.guide_image && "file_id" in customization_field.guide_image) {
        form_file_ids.push(customization_field.guide_image.file_id);
      }
    }

    // 1: Dismiss remote links
    await link.dismiss([
      {
        [Modules.PRODUCT]: {
          product_id: customization_form.product_id,
        },
        [CUSTOMIZATION_FORM_MODULE]: {
          customization_form_id: customization_form.id,
        },
      },
    ]);
  }

  // 2: Delete the customization forms
  await customizationFormModuleService.deleteCustomizationForms(customization_form_ids);

  // 3: Delete associated files
  if (form_file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: form_file_ids,
      },
    });
  }

  // ----- OPTION EXTENSIONS ----- 
  const optionExtensionModuleService: OptionExtensionModuleService = container.resolve(OPTION_EXTENSION_MODULE);

  const option_extensions = await optionExtensionModuleService.listOptionExtensions(
    {
      product_id: ids,
    },
    {
      relations: ["option_variations", "option_variations.option_image"],
    }
  );

  const option_extension_ids: string[] = [];
  const option_extension_file_ids: string[] = [];
  const extension_links: LinkDefinition[] = [];
  for (const option_extension of option_extensions) {
    for (const option_variation of option_extension.option_variations) {
      if (option_variation.option_image && "file_id" in option_variation.option_image) {
        option_extension_file_ids.push(option_variation.option_image.file_id);
      }
    }

    option_extension_ids.push(option_extension.id);

    extension_links.push({
      [Modules.PRODUCT]: {
        product_option_id: option_extension.option_id,
      },
      [OPTION_EXTENSION_MODULE]: {
        option_extension_id: option_extension.id,
      },
    });
  }

  // 1: Delete files
  if (option_extension_file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: option_extension_file_ids,
      },
    });
  }

  // 2: Delete option extensions
  await optionExtensionModuleService.deleteOptionExtensions(option_extension_ids);

  // 3: Dismiss remote links
  await link.dismiss(extension_links);
});
