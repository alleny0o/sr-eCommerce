import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import VariantMediaModuleService from "src/modules/variant-media/service";
import { VARIANT_MEDIA_MODULE } from "src/modules/variant-media";

type DeleteVariantMediasInput = {
    media_ids: string[];
};

const deleteVariantMediasStep = createStep(
    'delete-variant-medias-step',
    async ({ media_ids }: DeleteVariantMediasInput, { container }) => {
        const mediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
        
        const mediaToDelete = await mediaModuleService.listVariantMedias({
            id: media_ids
        });

        await mediaModuleService.deleteVariantMedias(media_ids);

        return new StepResponse({
            deletedMedias: mediaToDelete,
        }, {
            deletedMedias: mediaToDelete,
        });
    },
    async ({ deletedMedias }: any, { container }) => {
        const mediaModuleService: VariantMediaModuleService = container.resolve(VARIANT_MEDIA_MODULE);
        await mediaModuleService.createVariantMedias(deletedMedias);
    },
);

export default deleteVariantMediasStep;