import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";
import { MedusaError } from "@medusajs/framework/utils";

export type GetCustomizationFormStepInput = {
  product_id: string;
};

const getCustomizationFormStep = createStep(
  "get-customization-form-step",
  async (input: GetCustomizationFormStepInput, { container }) => {
    const customizationFormModuleService: CustomizationFormModuleService =
      container.resolve(CUSTOMIZATION_FORM_MODULE);
    const customization_forms =
      await customizationFormModuleService.listCustomizationForms(
        {
          product_id: input.product_id,
        },
        {
          relations: ["fields", "fields.guide_image"],
          order: {
            fields: "ASC",
          },
        }
      );

    if (!customization_forms.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No customization form found for product ${input.product_id}`
      );
    }

    const customization_form = customization_forms[0];

    return new StepResponse({
      customization_form: customization_form,
    });
  }
);

export default getCustomizationFormStep;
