import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { UpdateOptionVariationStepInput } from "./steps/update-option-variation";
import updateOptionVariationStep from "./steps/update-option-variation";

type UpdateOptionVariationWorkflowInput = UpdateOptionVariationStepInput;

const updateOptionVariationWorkflow = createWorkflow(
  "update-option-variation-workflow",
  (input: UpdateOptionVariationWorkflowInput) => {
    const result = updateOptionVariationStep(input);

    return new WorkflowResponse({
      updated_option_variation: result.updated_option_variation,
    });
  }
);

export default updateOptionVariationWorkflow;
