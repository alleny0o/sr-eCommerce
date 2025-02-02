import { defineMiddlewares } from "@medusajs/medusa";
import { validateAndTransformBody } from "@medusajs/framework";

// schemas
import {
  createCustomizationFieldsSchema,
  createMediasSchema,
  deleteCustomizationFieldsSchema,
  deleteFilesSchema,
  deleteOptionVariationSchema,
  updateCustomizationFieldsSchema,
  updateCustomizationFormSchema,
  updateOptionExtensionSchema,
  updateOptionVariationSchema,
} from "./validation-schemas";

// multer
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

// middlewares
export default defineMiddlewares({
  routes: [
    // ----- /admin/upload -----
    {
      matcher: "/admin/upload",
      method: "POST",
      middlewares: [upload.array("files")],
    },
    {
      matcher: "/admin/upload",
      method: "DELETE",
      middlewares: [validateAndTransformBody(deleteFilesSchema)],
    },

    // ----- /admin/product-variant_medias -----
    {
      matcher: "/admin/product-variant_medias",
      method: "POST",
      middlewares: [validateAndTransformBody(createMediasSchema)],
    },

    // ----- /admin/product_customization-forms -----
    {
      matcher: "/admin/product_customization-form/form",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateCustomizationFormSchema)],
    },
    {
      matcher: "/admin/product_customization-form/fields",
      method: "DELETE",
      middlewares: [validateAndTransformBody(deleteCustomizationFieldsSchema)],
    },
    {
      matcher: "/admin/product_customization-form/fields",
      method: "POST",
      middlewares: [validateAndTransformBody(createCustomizationFieldsSchema)],
    },
    {
      matcher: "/admin/product_customization-form/fields",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateCustomizationFieldsSchema)],
    },

    // ----- /admin/product_option-extensions -----
    {
      matcher: "/admin/product_option-extensions/option-extension",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateOptionExtensionSchema)],
    },
    {
      matcher: "/admin/product_option-extensions/option-variation",
      method: "PUT",
      middlewares: [validateAndTransformBody(updateOptionVariationSchema)],
    },
    {
      matcher: "/admin/product_option-extensions/option-variation",
      method: "DELETE",
      middlewares: [validateAndTransformBody(deleteOptionVariationSchema)],
    },
  ],
});
