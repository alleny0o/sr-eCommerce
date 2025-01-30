import { z } from 'zod';

// ----- FILES schemas -----
export const deleteFilesSchema = z.object({
    file_ids: z.array(z.string()),  
});

// ----- VARIANT MEDIAS schemas -----
export const createMediasSchema = z.object({
    medias: z.array(
        z.object({
            file_id: z.string(),
            product_id: z.string(),
            variant_id: z.string(),
            name: z.string(),
            size: z.number(),
            mime_type: z.string(),
            is_thumbnail: z.boolean(),
            url: z.string(),
        }),
    ),
});