import { createProductOptionsWorkflow } from "@medusajs/medusa/core-flows";
import createOptionExtensionWorkflow from "../option-extension/create-option-extension";

createProductOptionsWorkflow.hooks.productOptionsCreated(async ({ product_options }, { container }) => {
  // ----- OPTION EXTENSIONS -----
  for (const product_option of product_options) {
    await createOptionExtensionWorkflow(container).run({
      input: {
        product_id: product_option.product_id || "",
        option_id: product_option.id,
        option_title: product_option.title,
        option_variations: product_option.values.map((value) => ({
          variation_id: value.id,
        })),
      },
    });
  }
});