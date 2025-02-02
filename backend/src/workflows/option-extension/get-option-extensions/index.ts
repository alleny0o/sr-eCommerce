import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import getOptionExtensionsStep from "./steps/get-option-extensions";

type GetOptionExtensionsWorkflowInput = {
    product_id: string;
};

const getOptionExtensionsWorkflow = createWorkflow(
    "get-option-extensions-workflow",
    (input: GetOptionExtensionsWorkflowInput) => {
        const result = getOptionExtensionsStep(input);

        return new WorkflowResponse({
            option_extensions: result.option_extensions,
        });
    },
);

export default getOptionExtensionsWorkflow;