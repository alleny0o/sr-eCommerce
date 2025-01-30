import { z } from 'zod';
import createVariantMediasWorkflow from 'src/workflows/variant-media/create-variant-medias';
import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { createMediasSchema } from 'src/api/validation-schemas';
import { CreateVariantMediaInput } from 'src/workflows/variant-media/create-variant-medias/steps/create-variant-medias';

type CreateRequestBody = z.infer<typeof createMediasSchema>;

// Create new medias
export const POST = async (
    req: AuthenticatedMedusaRequest<CreateRequestBody>,
    res: MedusaResponse,
) => {
    const { result } = await createVariantMediasWorkflow(
        req.scope,
    ).run({
        input: {
            medias: req.validatedBody.medias.map((media) => ({
                file_id: media.file_id,
                product_id: media.product_id,
                variant_id: media.variant_id,
                name: media.name,
                size: media.size,
                mime_type: media.mime_type,
                is_thumbnail: media.is_thumbnail,
                url: media.url,
            })) as CreateVariantMediaInput[],
        }
    });

    res.status(200).json({ medias: result.medias });
}