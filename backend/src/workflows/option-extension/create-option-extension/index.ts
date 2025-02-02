import { createWorkflow, WorkflowResponse, when } from "@medusajs/framework/workflows-sdk";
import createOptionExtensionStep from "./steps/create-option-extension";
import createRemoteLinkStep from "./steps/create-link";
import createOptionVariationsStep from "./steps/create-variations";

export type OptionVariation = {
    variation_id: string;
};

export type CreateOptionExtensionWorkflowInput = {
    product_id: string;
    option_id: string;
    option_title: string;
    option_variations: OptionVariation[];
};

const createOptionExtensionWorkflow = createWorkflow(
    'create-option-extension-workflow',
    (input: CreateOptionExtensionWorkflowInput) => {
        // create the option extension and get it back
        const { option_extension } = createOptionExtensionStep({
            product_id: input.product_id,
            option_id: input.option_id,
            option_title: input.option_title,
        });

        // create the remote link between the product option and the option extension
        createRemoteLinkStep({
            product_option_id: input.option_id,
            option_extension_id: option_extension.id,
        });

        // check if we have option variations to create
        when(
            { input },
            ({ input }) => input.option_variations.length > 0,
        ).then(() => {
            createOptionVariationsStep({
                option_extension_id: option_extension.id,
                option_variations: input.option_variations,
            });
        });

        return new WorkflowResponse({
            option_extension: {
                ...option_extension,
            },
        });
    },
);

export default createOptionExtensionWorkflow;