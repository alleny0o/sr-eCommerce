import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// GET all medias for a variant by variant id
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: linkResults } = await query.graph({
    entity: "product_variant",
    fields: ["variant_medias.*"],
    filters: {
      id: variant_id,
    },
  });

  const mediaResults = linkResults[0].variant_medias;

  res.json({
    medias: mediaResults
      ?.map((m) => {
        if (!m) return null;
        return {
          id: m.id,
          file_id: m.file_id,
          product_id: m.product_id,
          variant_id: m.variant_id,
          url: m.url,
          mime_type: m.mime_type,
          is_thumbnail: m.is_thumbnail,
          name: m.name,
          size: m.size,
        };
      })
      .filter(Boolean),
  });
};

import deleteVariantMediasWorkflow from "src/workflows/variant-media/delete-variant-medias";
import { LinkDefinition } from "@medusajs/framework/types";
import { VARIANT_MEDIA_MODULE } from "src/modules/variant-media";

// DELETE all medias for a variant by variant id
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const variant_id = req.params.variant_id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const link = req.scope.resolve(ContainerRegistrationKeys.LINK);


  try {
    const { data: linkResults } = await query.graph({
      entity: "product_variant",
      fields: ["variant_medias.*"],
      filters: {
        id: variant_id,
      },
    });

    const mediaResults = linkResults[0].variant_medias;
    const media_ids = mediaResults?.filter((m) => m !== null).map((m) => m.id) || [];

    await deleteVariantMediasWorkflow(req.scope).run({
      input: {
        media_ids: media_ids,
      },
    });

    const links: LinkDefinition[] = [];

    for (const media_id of media_ids) {
      links.push({
        [Modules.PRODUCT]: {
          product_variant_id: variant_id,
        },
        [VARIANT_MEDIA_MODULE]: {
          variant_media_id: media_id,
        },
      });
    };

    await link.dismiss(links);

    res.json({
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  };
};
