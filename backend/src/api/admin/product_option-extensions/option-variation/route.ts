import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";

// PUT option variation
import { z } from "zod";
import { updateOptionVariationSchema } from "src/api/validation-schemas";
import updateOptionVariationWorkflow from "src/workflows/option-extension/update-option-variation";

type PutRequestBody = z.infer<typeof updateOptionVariationSchema>;

export const PUT = async (
    req: AuthenticatedMedusaRequest<PutRequestBody>,
    res: MedusaResponse,
) => {
    const { id, variation_id, color, option_image } = req.validatedBody;

    console.log("Running PUT /admin/product_option-extensions/option-variation");

    const { result } = await updateOptionVariationWorkflow(req.scope).run({
        input: {
            id,
            variation_id,
            color,
            option_image,
        },
    });

    res.status(200).json({ option_variation: result.updated_option_variation });
};

// DELETE option variation
import { deleteOptionVariationSchema } from "src/api/validation-schemas";
import deleteOptionVariationWorkflow from "src/workflows/option-extension/delete-option-variation";

type DeleteRequestBody = z.infer<typeof deleteOptionVariationSchema>;

export const DELETE = async (
    req: AuthenticatedMedusaRequest<DeleteRequestBody>,
    res: MedusaResponse,
) => {
    const { id } = req.validatedBody;

    const { result } = await deleteOptionVariationWorkflow(req.scope).run({
        input: {
            id,
        },
    });

    res.status(200).json({ option_extension: result.deleted_option_extension });
};