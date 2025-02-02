import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";
import { NullableModifier } from "@medusajs/framework/utils";

export type UpdateCustomizationFormStepInput = {
    id: string;
    name: string | null;
    active: boolean;
};

const updateCustomizationFormStep = createStep(
    'update-customization-form-step',
    async (input: UpdateCustomizationFormStepInput, { container }) => {
        const customizationFormModuleService:CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);
        
        const customization_form = await customizationFormModuleService.retrieveCustomizationForm(input.id);

        const updated_customization_form = await customizationFormModuleService.updateCustomizationForms({
            id: input.id,
            name: input.name,
            active: input.active,
        });

        return new StepResponse({
            customization_form: updated_customization_form,
        }, {
            customization_form: customization_form,
        });
    },
    async ({ customization_form }: any, { container }) => {
        const customizationFormModuleService:CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);
        
        await customizationFormModuleService.updateCustomizationForms({
            id: customization_form.id,
            name: customization_form.name,
            active: customization_form.active,
        });
    },
);

export default updateCustomizationFormStep;
