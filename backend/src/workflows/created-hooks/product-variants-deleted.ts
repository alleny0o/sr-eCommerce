// Core Flows
import { deleteProductVariantsWorkflow } from "@medusajs/medusa/core-flows";
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows";

// Services
import VariantMediaModuleService from "src/modules/variant-media/service";

// Module Definitions
import { VARIANT_MEDIA_MODULE } from "src/modules/variant-media";

// Workflows
import deleteVariantMediasWorkflow from "../variant-media/delete-variant-medias";

// Framework Utilities
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// Registering hook for when product variants are deleted
deleteProductVariantsWorkflow.hooks.productVariantsDeleted(async ({ ids }, { container }) => {
  // Resolve services and utilities
  const variantMediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  /* ----- VARIANT MEDIA ----- */
  // Fetch variant media associated with the deleted variants
  const medias = await variantMediaModuleService.listVariantMedias({
    variant_id: ids,
  });

  // Prepare IDs and link definitions for cleanup
  const file_ids: string[] = [];
  const media_ids: string[] = [];
  const links: LinkDefinition[] = [];
  for (const media of medias) {
    file_ids.push(media.file_id); // Collect file IDs for deletion
    media_ids.push(media.id); // Collect media IDs for deletion
    links.push({
      [Modules.PRODUCT]: {
        product_variant_id: media.variant_id,
      },
      [VARIANT_MEDIA_MODULE]: {
        variant_media_id: media.id,
      },
    }); // Prepare link definitions
  }

  // Delete associated files if any exist
  if (file_ids.length > 0) {
    await deleteFilesWorkflow(container).run({
      input: {
        ids: file_ids,
      },
    });
  }

  // Delete associated media records if any exist
  if (media_ids.length > 0) {
    await deleteVariantMediasWorkflow(container).run({
      input: {
        media_ids: media_ids,
      },
    });
  }

  // Dismiss associated links if any exist
  if (links.length > 0) {
    await link.dismiss(links);
  }
});
