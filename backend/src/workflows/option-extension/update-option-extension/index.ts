import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import updateOptionExtensionStep from "./steps/update-option-extension";

type UpdateOptionExtensionWorkflowInput = {
    id: string;
    option_title?: string;
    display_type?: "buttons" | "dropdown" | "colors" | "images";
    is_selected?: boolean;
};

const updateOptionExtensionWorkflow = createWorkflow(
    'update-option-extension-workflow',
    (input: UpdateOptionExtensionWorkflowInput) => {
        const result = updateOptionExtensionStep({
            id: input.id,
            option_title: input.option_title,
            display_type: input.display_type,
            is_selected: input.is_selected,
        });

        return new WorkflowResponse({
            option_extension: result.option_extension,
        });
    },
);

export default updateOptionExtensionWorkflow;
