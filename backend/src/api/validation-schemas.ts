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

// ----- CUSTOMIZATION FORM schemas -----
export const updateCustomizationFormSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    active: z.boolean(),
});

export const deleteCustomizationFieldsSchema = z.object({
    field_ids: z.array(z.string()),
});

export const updateCustomizationFieldsSchema = z.object({
    fields: z.array(z.object({
        id: z.string(),
        uuid: z.string(),
        display_type: z.enum(['text', 'textarea', 'dropdown', 'image']),
        label: z.string().nullable(),
        description: z.string().nullable(),
        placeholder: z.string().nullable(),
        options: z.array(z.string()).nullable(),
        required: z.boolean(),
        guide_image: z.object({
            id: z.string().nullable(),
            file_id: z.string(),
            name: z.string(),
            size: z.number(),
            mime_type: z.string(),
            url: z.string(),
        }).nullable(),
    })),
});

export const createCustomizationFieldsSchema = z.object({
    fields: z.array(z.object({
        id: z.null(),
        uuid: z.string(),
        display_type: z.enum(['text', 'textarea', 'dropdown', 'image']),
        label: z.string().nullable(),
        description: z.string().nullable(),
        placeholder: z.string().nullable(),
        options: z.array(z.string()).nullable(),
        required: z.boolean(),
        guide_image: z.object({
            id: z.string().nullable(),
            file_id: z.string(),
            name: z.string(),
            size: z.number(),
            mime_type: z.string(),
            url: z.string(),
        }).nullable(),
    })),
    product_id: z.string(),
});

// ----- OPTION EXTENSION schemas -----
export const updateOptionExtensionSchema = z.object({
    id: z.string(),
    option_title: z.string().optional(),
    display_type: z.any().optional(),
    is_selected: z.boolean().optional(),
});

export const updateOptionVariationSchema = z.object({
    id: z.string(),
    variation_id: z.string().nullable(),
    color: z.string().nullable(),
    option_image: z.object({
        file_id: z.string(),
        name: z.string(),
        size: z.number(),
        mime_type: z.string(),
        url: z.string(),
    }).nullable(),
});

export const deleteOptionVariationSchema = z.object({
    id: z.string(),
});