import { loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

/**
 * Public URL for the backend
 */
export const BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? process.env.RAILWAY_PUBLIC_DOMAIN_VALUE ?? 'http://localhost:9000'