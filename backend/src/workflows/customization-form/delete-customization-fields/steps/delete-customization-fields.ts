import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";

export type DeleteCustomizationFieldsStepInput = {
    ids: string[];
};

const deleteCustomizationFieldsStep = createStep(
    'delete-customization-fields-step',
    async (input: DeleteCustomizationFieldsStepInput, { container }) => {
        const customizationFormModuleService: CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);
        const fieldsToDelete = await customizationFormModuleService.listCustomizationFields({
            id: input.ids,
        }, {
            relations: ['guide_image'],
        });

        await customizationFormModuleService.deleteCustomizationFields(input.ids);

        return new StepResponse({
            deleted_fields: fieldsToDelete,
        }, {
            deleted_fields: fieldsToDelete,
        });
    },
    async ({ deleted_fields }: any, { container }) => {
        const customizationFormModuleService: CustomizationFormModuleService = container.resolve(CUSTOMIZATION_FORM_MODULE);

        // Batch create customization fields
        const fieldsToCreate = deleted_fields.map((field: any) => ({
            uuid: field.uuid,
            display_type: field.display_type,
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            options: field.options,
            required: field.required,
            customization_form_id: field.customization_form_id,
        }));

        const restored_fields = await customizationFormModuleService.createCustomizationFields(fieldsToCreate);

        // Create a mapping between original UUIDs and restored fields
        const restoredFieldMap = restored_fields.reduce((acc: Record<string, string>, field: any) => {
            acc[field.uuid] = field.id; // Map UUID to new ID
            return acc;
        }, {});

        // Batch create guide images
        const guideImagesToCreate = deleted_fields
            .filter((field: any) => field.guide_image) // Only include fields with guide images
            .map((field: any) => ({
                file_id: field.guide_image.file_id,
                name: field.guide_image.name,
                size: field.guide_image.size,
                mime_type: field.guide_image.mime_type,
                url: field.guide_image.url,
                customization_field_id: restoredFieldMap[field.uuid], // Use the new ID from the map
            }));

        if (guideImagesToCreate.length > 0) {
            await customizationFormModuleService.createGuideImages(guideImagesToCreate);
        }
    }
);

export default deleteCustomizationFieldsStep;
