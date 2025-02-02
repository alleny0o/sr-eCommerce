// Core Flows
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

// Workflows
import createCustomizationFormWorkflow from "../customization-form/create-customization-form";
import createOptionExtensionWorkflow from "../option-extension/create-option-extension";

createProductsWorkflow.hooks.productsCreated(async ({ products }, { container }) => {
  // ----- CUSTOMIZATION FORM -----
  for (const product of products) {
    await createCustomizationFormWorkflow(container).run({
      input: {
        product_id: product.id,
      },
    });
  }

  // ----- OPTION EXTENSIONS -----
  for (const product of products) {
    for (const option of product.options) {
      await createOptionExtensionWorkflow(container).run({
        input: {
          product_id: product.id,
          option_id: option.id,
          option_title: option.title,
          option_variations: option.values.map((value) => ({
            variation_id: value.id,
          })),
        },
      });
    }
  }
});
