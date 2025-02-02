import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { updateOptionExtensionSchema } from "src/api/validation-schemas";

// PUT option extension
import updateOptionExtensionWorkflow from "src/workflows/option-extension/update-option-extension";
import { z } from "zod";

type PutRequestBody = z.infer<typeof updateOptionExtensionSchema>;

export const PUT = async (
    req: AuthenticatedMedusaRequest<PutRequestBody>,
    res: MedusaResponse,
) => {
    const { id } = req.body;

    const { result } = await updateOptionExtensionWorkflow(req.scope).run({
        input: {
            id: id,
            option_title: req.body.option_title,
            display_type: req.body.display_type,
            is_selected: req.body.is_selected,
        },
    });

    res.status(200).json({ option_extension: result.option_extension });
};