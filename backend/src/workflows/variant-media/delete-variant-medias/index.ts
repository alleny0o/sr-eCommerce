import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import deleteVariantMediasStep from './steps/delete-variant-medias';

type DeleteMediasWorkflowInput = {
    media_ids: string[];
};

const deleteVariantMediasWorkflow = createWorkflow(
    'delete-variant-medias-workflow',
    (input: DeleteMediasWorkflowInput) => {
        const { media_ids } = input;

        const { deletedMedias } = deleteVariantMediasStep({ media_ids });

        return new WorkflowResponse({
            deleted_medias: deletedMedias,
        });
    },
);

export default deleteVariantMediasWorkflow;