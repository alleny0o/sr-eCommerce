import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { DeleteOptionVariationStepInput } from "./steps/delete-option-variation";
import deleteOptionVariationStep from "./steps/delete-option-variation";

type DeleteOptionVariationWorkflowInput = DeleteOptionVariationStepInput;

const deleteOptionVariationWorkflow = createWorkflow(
  "delete-option-variation-workflow",
  (input: DeleteOptionVariationWorkflowInput) => {
    const result = deleteOptionVariationStep(input);

    return new WorkflowResponse({
      deleted_option_extension: result.option_extension,
    });
  },
);

export default deleteOptionVariationWorkflow;
