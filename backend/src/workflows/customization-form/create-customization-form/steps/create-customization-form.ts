import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";

export type CreateCustomizationFormStepInput = {
    product_id: string;
    form_name?: string;
    is_active?: boolean;
};

const createCustomizationFormStep = createStep(
    'create-customization-form-step',
    async (input: CreateCustomizationFormStepInput, { container }) => {
        const customizationFormModuleService: CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);
        const customizationForm = await customizationFormModuleService.createCustomizationForms(input);

        return new StepResponse({
            customization_form: customizationForm,
        }, {
            customization_form_id: customizationForm.id,
        });
    },
    async ({ customization_form_id }: { customization_form_id: string }, { container }) => {
        const customizationFormModuleService: CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);
        await customizationFormModuleService.deleteCustomizationForms(customization_form_id);
    },
);

export default createCustomizationFormStep;