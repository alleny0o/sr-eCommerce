import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

// UPDATE customization form
import updateCustomizationFormWorkflow from "src/workflows/customization-form/update-customization-form";
import { updateCustomizationFormSchema } from "src/api/validation-schemas";
type PutRequestBody = z.infer<typeof updateCustomizationFormSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<PutRequestBody>, res: MedusaResponse) => {
    const { id, name, active } = req.validatedBody;

    const { result } = await updateCustomizationFormWorkflow(req.scope).run({
        input: {
            id,
            name,
            active,
        },
    });

    res.status(200).json({
        customization_form: result.customization_form,
    });
};