import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import CustomizationFormModuleService from "src/modules/customization-form/service";
import { CUSTOMIZATION_FORM_MODULE } from "src/modules/customization-form";

export type CreateCustomizationFieldsStepInput = {
  fields: {
    id: null;
    uuid: string;
    display_type: "text" | "textarea" | "dropdown" | "image";
    label: string | null;
    description: string | null;
    placeholder: string | null;
    options: string[] | null;
    required: boolean;
    guide_image: {
      file_id: string;
      name: string;
      size: number;
      mime_type: string;
      url: string;
    } | null;
  }[];
  product_id: string;
};

const createCustomizationFieldsStep = createStep(
  "create-customization-fields-step",
  async (input: CreateCustomizationFieldsStepInput, { container }) => {
    const customizationFormModuleService: CustomizationFormModuleService =
      container.resolve(CUSTOMIZATION_FORM_MODULE);
    
    const customization_forms = await customizationFormModuleService.listCustomizationForms({
        product_id: input.product_id,
    });

    const customization_form = customization_forms[0];

    const created_fields_ids: string[] = [];    
    for (const field of input.fields) {
      const new_field = await customizationFormModuleService.createCustomizationFields({
        uuid: field.uuid,
        display_type: field.display_type,
        label: field.label,
        description: field.description,
        placeholder: field.placeholder,
        options: field.options,
        required: field.required,
        customization_form_id: customization_form.id,
      });

     created_fields_ids.push(new_field.id);

      if (field.guide_image) {
        await customizationFormModuleService.createGuideImages({
          file_id: field.guide_image.file_id,
          name: field.guide_image.name,
          size: field.guide_image.size,
          mime_type: field.guide_image.mime_type,
          url: field.guide_image.url,
          customization_field_id: new_field.id,
        });
      }
    };

    return new StepResponse(
      {
        success: true,
      },
      {
        created_fields_ids: created_fields_ids,
      }
    );
  },
  async ({ created_fields_ids }: { created_fields_ids: string[] }, { container }) => {
    const customizationFormModuleService: CustomizationFormModuleService =
      container.resolve(CUSTOMIZATION_FORM_MODULE);

    await customizationFormModuleService.deleteCustomizationFields(created_fields_ids);
  }
);

export default createCustomizationFieldsStep;