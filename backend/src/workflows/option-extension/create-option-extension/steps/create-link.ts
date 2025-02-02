import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { OPTION_EXTENSION_MODULE } from "src/modules/option-extension";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

type CreateRemoteLinkStepInput = {
  product_option_id: string;
  option_extension_id: string;
};

const createRemoteLinkStep = createStep(
  "create-remote-link-product-option-to-option-extension-step",
  async (input: CreateRemoteLinkStepInput, { container }) => {
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const links: LinkDefinition[] = [];

    links.push({
      [Modules.PRODUCT]: {
        product_option_id: input.product_option_id,
      },
      [OPTION_EXTENSION_MODULE]: {
        option_extension_id: input.option_extension_id,
      },
    });

    await link.create(links);

    return new StepResponse(
      {
        links,
      },
      {
        links,
      }
    );
  },
  async ({ links }: any, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    await remoteLink.delete(links);
  }
);

export default createRemoteLinkStep;
