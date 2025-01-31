import Medusa from "@medusajs/js-sdk"
import { loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "<http://localhost:9000>",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})