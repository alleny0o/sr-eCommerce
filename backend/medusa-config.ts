// Copyright (c) 2023. Medusa Technologies GmbH. All rights reserved.
import { loadEnv, defineConfig } from "@medusajs/framework/utils";

// load env
loadEnv(process.env.NODE_ENV || "development", process.cwd());

// variables
const PRODUCTION = process.env.NODE_ENV === "production";
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";

// export config
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    ...(!PRODUCTION ? {} : { redisUrl: process.env.REDIS_URL }),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    // REDIS MODULES
    ...(PRODUCTION
      ? [
          {
            resolve: "@medusajs/medusa/cache-redis",
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
          {
            resolve: "@medusajs/medusa/event-bus-redis",
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
          {
            resolve: "@medusajs/medusa/workflow-engine-redis",
            options: {
              redis: {
                url: process.env.REDIS_URL,
              },
            },
          },
        ]
      : []),
    // AWS S3 MODULES
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          ...(PRODUCTION
            ? [
                {
                  resolve: "@medusajs/medusa/file-s3",
                  id: "s3",
                  options: {
                    file_url: process.env.S3_FILE_URL,
                    access_key_id: process.env.S3_ACCESS_KEY_ID,
                    secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                    region: process.env.S3_REGION,
                    bucket: process.env.S3_BUCKET,
                    endpoint: process.env.S3_ENDPOINT,
                  },
                },
              ]
            : [
                {
                  resolve: "@medusajs/medusa/file-local",
                  id: "local",
                  options: {
                    upload_dir: "static",
                    backend_url: `${BACKEND_URL}/static`,
                  },
                },
              ]),
        ],
      },
    },
    // RESEND MODULES
    ...(!PRODUCTION
      ? [
          {
            resolve: "@medusajs/medusa/notification",
            options: {
              providers: [
                {
                  resolve: "./src/modules/resend",
                  id: "resend",
                  options: {
                    channels: ["email"],
                    api_key: process.env.RESEND_API_KEY,
                    from: process.env.RESEND_FROM_EMAIL,
                  },
                },
              ],
            },
          },
        ]
      : []),
    // STRIPE MODULES
    ...(!PRODUCTION
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                  },
                },
              ],
            },
          },
        ]
      : []),
    /* CUSTOM MODULES I MADE!! */
    // product variant media module
    {
      resolve: "./src/modules/variant-media",
    },
    // product option extension module
    {
      resolve: "./src/modules/option-extension",
    },
    // product customization form module
    {
      resolve: "./src/modules/customization-form",
    },
    // customer product review module
    {
      resolve: "./src/modules/customer-review",
    },
  ],
});
