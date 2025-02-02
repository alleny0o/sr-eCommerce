import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import createCustomizationFieldsStep, { CreateCustomizationFieldsStepInput } from "./steps/create-customization-fields";

type CreateCustomizationFieldsWorkflowInput = CreateCustomizationFieldsStepInput;

const createCustomizationFieldsWorkflow = createWorkflow(
    'create-customization-fields-workflow',
    (input: CreateCustomizationFieldsWorkflowInput) => {
        const result = createCustomizationFieldsStep(input);

        return new WorkflowResponse({
            success: result.success,
        });
    },
);

export default createCustomizationFieldsWorkflow;