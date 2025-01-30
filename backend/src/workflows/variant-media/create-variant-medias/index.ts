import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createVariantMediasStep, { CreateVariantMediaInput } from "./steps/create-variant-medias";
import createRemoteLinkStep from "./steps/create-link";

// types
import { InferTypeOf } from "@medusajs/framework/types";
import VariantMedia from "src/modules/variant-media/models/variant-media";

type CreateMediasWorkflowInput = {
  medias: CreateVariantMediaInput[];
};

export type MediaResponse = InferTypeOf<typeof VariantMedia>;

const createVariantMediasWorkflow = createWorkflow("create-variant-medias-workflow", (input: CreateMediasWorkflowInput) => {
  const { medias } = input;

  const { medias: createdMedias }: { medias: MediaResponse[] } = createVariantMediasStep({ medias });

  createRemoteLinkStep({ medias: createdMedias });

  return new WorkflowResponse({
    medias: createdMedias,
  });
});

export default createVariantMediasWorkflow;
