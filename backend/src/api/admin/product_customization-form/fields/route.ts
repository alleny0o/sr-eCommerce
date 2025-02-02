import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";

// DELETE customization fields
import { deleteCustomizationFieldsSchema } from "src/api/validation-schemas";
import deleteCustomizationFieldsWorkflow from "src/workflows/customization-form/delete-customization-fields";

type DeleteRequestBody = z.infer<typeof deleteCustomizationFieldsSchema>;   

export const DELETE = async (req: AuthenticatedMedusaRequest<DeleteRequestBody>, res: MedusaResponse) => {
    const { field_ids } = req.validatedBody;

    const { result } = await deleteCustomizationFieldsWorkflow(req.scope).run({
        input: {
            ids: field_ids,
        },
    });

    res.status(200).json({
        deleted_fields: result.deleted_fields,
    });
};

// UPDATE customization fields
import { updateCustomizationFieldsSchema } from "src/api/validation-schemas";
import updateCustomizationFieldsWorkflow from "src/workflows/customization-form/update-customization-fields";

type UpdateRequestBody = z.infer<typeof updateCustomizationFieldsSchema>;

export const PUT = async (req: AuthenticatedMedusaRequest<UpdateRequestBody>, res: MedusaResponse) => {
    const { fields } = req.validatedBody;

    const { result } = await updateCustomizationFieldsWorkflow(req.scope).run({
        input: {
            fields,
        },
    });

    res.status(200).json({
        updated_fields: result.updated_fields,
    });
};

// CREATE customization fields
import { createCustomizationFieldsSchema } from "src/api/validation-schemas";
import createCustomizationFieldsWorkflow from "src/workflows/customization-form/create-customization-fields";

type CreateRequestBody = z.infer<typeof createCustomizationFieldsSchema>;

export const POST = async (req: AuthenticatedMedusaRequest<CreateRequestBody>, res: MedusaResponse) => {
    const { fields, product_id } = req.validatedBody;

    const { result } = await createCustomizationFieldsWorkflow(req.scope).run({
        input: {
            fields,
            product_id,
        },
    });

    res.status(200).json({
        success: result.success,
    });
};
