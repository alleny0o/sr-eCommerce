// Copyright (c) 2023. Medusa Technologies GmbH. All rights reserved.
import { loadEnv, defineConfig } from "@medusajs/framework/utils";

// import variables
import {
  IS_PRODUCTION,
  BACKEND_URL,
  DATABASE_URL,
  REDIS_URL,
  ADMIN_CORS,
  AUTH_CORS,
  STORE_CORS,
  JWT_SECRET,
  COOKIE_SECRET,
} from "src/lib/constants";

// load env
loadEnv(process.env.NODE_ENV || "development", process.cwd());

// export config
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    ...(!IS_PRODUCTION ? {} : { redisUrl: REDIS_URL }),
    http: {
      storeCors: STORE_CORS!,
      adminCors: ADMIN_CORS!,
      authCors: AUTH_CORS!,
      jwtSecret: JWT_SECRET || "supersecret",
      cookieSecret: COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    // redis modules
    ...(IS_PRODUCTION
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
    // aws s3
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          ...(IS_PRODUCTION
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
    // variant media module
    {
      resolve: "./src/modules/variant-media",
    },
  ],
});
