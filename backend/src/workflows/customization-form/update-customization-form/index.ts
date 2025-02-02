import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateCustomizationFormStep, { UpdateCustomizationFormStepInput } from "./steps/update-customization-form";

type UpdateCustomizationFormWorkflowInput = UpdateCustomizationFormStepInput;

const updateCustomizationFormWorkflow = createWorkflow(
    'update-customization-form-workflow',
    (input: UpdateCustomizationFormWorkflowInput) => {

        const result = updateCustomizationFormStep(input);

        return new WorkflowResponse({
            customization_form: result.customization_form,
        });
    },
);

export default updateCustomizationFormWorkflow;