import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getCustomizationFormStep, { GetCustomizationFormStepInput } from "./steps/get-customization-form";

type GetCustomizationFormWorkflowInput = GetCustomizationFormStepInput;

const getCustomizationFormWorkflow = createWorkflow(
    'get-customization-form-workflow',
    (input: GetCustomizationFormWorkflowInput) => {
        const result = getCustomizationFormStep(input);

        return new WorkflowResponse({
            customization_form: result.customization_form,
        });
    },
);

export default getCustomizationFormWorkflow;