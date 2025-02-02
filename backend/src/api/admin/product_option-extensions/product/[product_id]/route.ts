import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";

// GET option extensions for a product by product_id
import getOptionExtensionsWorkflow from "src/workflows/option-extension/get-option-extensions";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const { product_id } = req.params;

  try {
    const { result } = await getOptionExtensionsWorkflow(req.scope).run({
      input: {
        product_id,
      },
    });

    if (!result.option_extensions) {
      return res.status(404).json({
        success: false,
        message: "Option extensions not found",
      });
    }

    res.status(200).json({ option_extensions: result.option_extensions });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};
