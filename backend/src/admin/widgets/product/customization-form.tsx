// widget config
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// props
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";

// state
import { useState, useEffect } from "react";

// types
import { CustomizationFieldType, CustomizationFormType, Field, Form } from "../../types/customization-form";

// ui
import { Badge } from "@medusajs/ui";

// components
import { UpdateFormModal } from "../../components/product/customization-form/update-form-modal";
import Base from "../../components/product/customization-form/base";
import InfoTable from "../../components/product/customization-form/info-table";

// js sdk
import { sdk } from "../../lib/config";

// tanstack useQuery
import { useQuery } from "@tanstack/react-query";

const CustomizationFormWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  // customization form state
  const [form, setForm] = useState<Form | null>(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);

  // useQuery to gather customization form data
  const {
    data: customizationForm,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customization-form", data.id],
    queryFn: () =>
      sdk.client.fetch<{ customization_form: CustomizationFormType }>(`/admin/product_customization-form/product/${data.id}`),
    refetchOnMount: "always",
  });

  // useEffect to set form state
  useEffect(() => {
    if (customizationForm) {
      const customization_form = customizationForm.customization_form;
      const updatedForm: Form = {
        id: customization_form.id,
        product_id: customization_form.product_id,
        name: customization_form.name,
        active: customization_form.active,
        fields: customization_form.fields.map((field: CustomizationFieldType) => {
          return {
            id: field.id,
            uuid: field.uuid,
            display_type: field.display_type,
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            options: field.options,
            required: field.required,
            guide_image: field.guide_image,
          } as Field;
        }),
      };

      setForm(updatedForm);
    }
  }, [customizationForm]);

  if (isLoading) {
    return (
      <Base heading="Customization Form">
        <div className="flex justify-center items-center min-h-32">
          <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
        </div>
      </Base>
    );
  }

  if (error || !customizationForm) {
    return (
      <Base heading="Customization Form">
        <div className="flex flex-col justify-center items-center min-h-32 space-y-2">
          <Badge size="base" color="red">
            ERROR: Failed to retrieve customization form
          </Badge>
          <p className="w-[90%] text-center text-xs text-gray-600">
            Connection error or form does not exist. If you see this message multiple times, let the developer know.
          </p>
        </div>
      </Base>
     );
  }

  if (!form) {
    return (
      <Base heading="Customization Form">
        <div className="flex justify-center items-center min-h-32">
          <div className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 animate-spin aspect-square w-10 flex justify-center items-center text-yellow-700"></div>
        </div>
      </Base>
    );
  }

  return (
    <Base
      heading="Customization Form"
      modal={
        <UpdateFormModal product_id={data.id} customizationForm={form} focusModal={modalOpen} setFocusModal={setModalOpen} />
      }
    >
      <InfoTable form={form} setModalOpen={setModalOpen} />
    </Base>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default CustomizationFormWidget;
