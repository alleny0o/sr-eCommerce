import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import VariantMediaModuleService from "src/modules/variant-media/service";
import { VARIANT_MEDIA_MODULE } from "src/modules/variant-media";
import { MediaResponse } from "..";

export type CreateVariantMediaInput = {
  file_id: string;
  product_id: string;
  variant_id: string;
  name: string;
  size: number;
  mime_type: string;
  is_thumbnail: boolean;
  url: string;
};

export type CreateVariantMediasStepInput = {
  medias: CreateVariantMediaInput[];
};

const createVariantMediasStep = createStep(
  "create-variant-medias-step",
  async ({ medias }: CreateVariantMediasStepInput, { container }) => {
    const mediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
    const createdMedias: MediaResponse[] = await mediaModuleService.createVariantMedias(medias);

    return new StepResponse(
      {
        medias: createdMedias,
      },
      {
        medias: createdMedias,
      }
    );
  },
  async ({ medias }: any, { container }) => {
    const mediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
    await mediaModuleService.deleteVariantMedias(medias.map((media) => media.id));
  }
);

export default createVariantMediasStep;
