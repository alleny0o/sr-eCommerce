import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateCustomizationFieldsStep, { UpdateCustomizationFieldsStepInput } from "./steps/update-customization-fields";

type UpdateCustomizationFieldsWorkflowInput = UpdateCustomizationFieldsStepInput;

const updateCustomizationFieldsWorkflow = createWorkflow(
    'update-customization-fields-workflow',
    (input: UpdateCustomizationFieldsWorkflowInput) => {
        const result = updateCustomizationFieldsStep(input);

        return new WorkflowResponse({
            updated_fields: result.updated_fields,
        });
    },
);

export default updateCustomizationFieldsWorkflow;