import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const ids = req.query.ids as string[];

    if (!ids || ids.length === 0) {
        return res.status(400).json({ error: "ids is required and must not be empty" });
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { data: linkResults } = await query.graph({
        entity: "product_option_value",
        fields: ["*"],
        filters: {
            id: ids,
        },
    });

    // Create a map for quick lookup
    const resultMap = new Map(linkResults.map(result => [result.id, result]));

    // Sort the results based on the order of input ids
    const sortedResults = ids.map(id => resultMap.get(id)).filter(Boolean);

    res.status(200).json({ 
        values: sortedResults, 
    });
};