import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import getCustomizationFormWorkflow from "src/workflows/customization-form/get-customization-form";

// GET customization form based on product id
export const GET = async (
  req: AuthenticatedMedusaRequest<{ product_id: string }>,
  res: MedusaResponse
) => {
  const { product_id } = req.params;

  try {
    const { result } = await getCustomizationFormWorkflow(req.scope).run({
      input: { product_id },
    });

    if (!result.customization_form) {
      return res.status(404).json({
        success: false,
        message: "Customization form not found",
      });
    }

    return res.status(200).json({
      success: true,
      customization_form: result.customization_form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
