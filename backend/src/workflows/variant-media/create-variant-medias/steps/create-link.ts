import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateVariantMediaInput } from "./create-variant-medias";
import { VARIANT_MEDIA_MODULE } from "src/modules/variant-media";
import { LinkDefinition } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export type CreateLinkInput = {
  medias: (CreateVariantMediaInput & { id: string })[];
};

const createRemoteLinkStep = createStep(
  "create-varinat-media-remote-link-step",
  async ({ medias }: CreateLinkInput, { container }) => {
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const links: LinkDefinition[] = [];

    for (const media of medias) {
      links.push({
        [Modules.PRODUCT]: {
          product_variant_id: media.variant_id,
        },
        [VARIANT_MEDIA_MODULE]: {
          variant_media_id: media.id,
        },
      });
    }

    await link.create(links);

    return new StepResponse(links, links);
  },
  async (links, { container }) => {
    if (!links?.length) return;

    const remoteLink = container.resolve("remoteLink");
    await remoteLink.dismiss(links);
  }
);

export default createRemoteLinkStep;
