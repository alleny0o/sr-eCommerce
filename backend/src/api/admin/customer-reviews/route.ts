import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: reviews, metadata: { count, take, skip } = {} } = await query.graph({
    entity: "customer_review",
    ...req.queryConfig,
  });

  res.json({
    reviews,
    count,
    limit: take,
    offset: skip,
  });
};
