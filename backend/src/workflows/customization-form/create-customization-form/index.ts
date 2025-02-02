import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { CreateCustomizationFormStepInput } from "./steps/create-customization-form";
import createCustomizationFormStep from "./steps/create-customization-form";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";

type CreateCustomizationFormWorkflowInput = CreateCustomizationFormStepInput;

const createCustomizationFormWorkflow = createWorkflow(
    'create-customization-form-workflow',
    (input: CreateCustomizationFormWorkflowInput) => {
        const result = createCustomizationFormStep(input);

        createRemoteLinkStep([{
            [Modules.PRODUCT]: {
                product_id: input.product_id,
            },
            [CUSTOMIZATION_FORM_MODULE]: {
                customization_form_id: result.customization_form.id,
            },
        }]);

        return new WorkflowResponse({
            customization_form: result.customization_form,
        });
    },
);

export default createCustomizationFormWorkflow;