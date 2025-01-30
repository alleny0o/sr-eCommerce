import { defineMiddlewares } from "@medusajs/medusa";
import { validateAndTransformBody } from "@medusajs/framework";

// schemas
import { createMediasSchema, deleteFilesSchema } from "./validation-schemas";

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
    ],
  });