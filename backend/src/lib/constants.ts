import { loadEnv } from "@medusajs/framework/utils";
import { assertValue } from "src/utils/assert-value";

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

/**
 * Is production environment
 */
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Public URL for the backend
 */
export const BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? process.env.RAILWAY_PUBLIC_DOMAIN_VALUE ?? "http://localhost:9000";

/**
 * Database URL for Postgres instance used by the backend
 */
export const DATABASE_URL = assertValue(process.env.DATABASE_URL, "Environment variable for DATABASE_URL is not set");

/**
 * (optional) Redis URL for Redis instance used by the backend
 */
export const REDIS_URL = process.env.REDIS_URL;

/**
 * Admin CORS origins
 */
export const ADMIN_CORS = assertValue(process.env.ADMIN_CORS, "Environment variable for ADMIN_CORS is not set");

/**
 * Auth CORS origins
 */
export const AUTH_CORS = assertValue(process.env.AUTH_CORS, "Environment variable for AUTH_CORS is not set");

/**
 * Store/frontend CORS origins
 */
export const STORE_CORS = assertValue(process.env.STORE_CORS, "Environment variable for STORE_CORS is not set");

/**
 * JWT Secret used for signing JWT tokens
 */
export const JWT_SECRET = assertValue(process.env.JWT_SECRET, "Environment variable for JWT_SECRET is not set");

/**
 * Cookie secret used for signing cookies
 */
export const COOKIE_SECRET = assertValue(process.env.COOKIE_SECRET, "Environment variable for COOKIE_SECRET is not set");

/**
 * Worker mode
 */
export const WORKER_MODE = (process.env.MEDUSA_WORKER_MODE as "worker" | "server" | "shared" | undefined) ?? "shared";

/**
 * Disable Admin
 */
export const SHOULD_DISABLE_ADMIN = process.env.MEDUSA_DISABLE_ADMIN === "true";
