import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import deleteCustomizationFieldsStep, { DeleteCustomizationFieldsStepInput } from "./steps/delete-customization-fields";

type DeleteCustomizationFieldsWorkflowInput = DeleteCustomizationFieldsStepInput;

const deleteCustomizationFieldsWorkflow = createWorkflow(
    'delete-customization-fields-workflow',
    (input: DeleteCustomizationFieldsWorkflowInput) => {
        const result = deleteCustomizationFieldsStep(input);

        return new WorkflowResponse({
            deleted_fields: result.deleted_fields,
        });
    },
);

export default deleteCustomizationFieldsWorkflow;