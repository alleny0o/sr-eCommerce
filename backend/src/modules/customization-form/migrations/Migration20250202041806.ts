import { Migration } from '@mikro-orm/migrations';

export class Migration20250202041806 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "guide_image" drop constraint if exists "guide_image_customization_field_id_unique";`);
    this.addSql(`alter table if exists "guide_image" drop constraint if exists "guide_image_file_id_unique";`);
    this.addSql(`alter table if exists "customization_field" drop constraint if exists "customization_field_uuid_unique";`);
    this.addSql(`alter table if exists "customization_form" drop constraint if exists "customization_form_product_id_unique";`);
    this.addSql(`create table if not exists "customization_form" ("id" text not null, "product_id" text not null, "name" text null, "active" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customization_form_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customization_form_product_id_unique" ON "customization_form" (product_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_form_deleted_at" ON "customization_form" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customization_field" ("id" text not null, "uuid" text not null, "display_type" text check ("display_type" in ('text', 'textarea', 'dropdown', 'image')) not null, "label" text null, "description" text null, "placeholder" text null, "options" text[] null, "required" boolean not null default false, "customization_form_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customization_field_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customization_field_uuid_unique" ON "customization_field" (uuid) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_field_customization_form_id" ON "customization_field" (customization_form_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_field_deleted_at" ON "customization_field" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "guide_image" ("id" text not null, "file_id" text not null, "name" text not null, "size" integer not null, "mime_type" text not null, "url" text not null, "customization_field_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "guide_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_guide_image_file_id_unique" ON "guide_image" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_guide_image_customization_field_id_unique" ON "guide_image" (customization_field_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_guide_image_deleted_at" ON "guide_image" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "customization_field" add constraint "customization_field_customization_form_id_foreign" foreign key ("customization_form_id") references "customization_form" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "guide_image" add constraint "guide_image_customization_field_id_foreign" foreign key ("customization_field_id") references "customization_field" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customization_field" drop constraint if exists "customization_field_customization_form_id_foreign";`);

    this.addSql(`alter table if exists "guide_image" drop constraint if exists "guide_image_customization_field_id_foreign";`);

    this.addSql(`drop table if exists "customization_form" cascade;`);

    this.addSql(`drop table if exists "customization_field" cascade;`);

    this.addSql(`drop table if exists "guide_image" cascade;`);
  }

}
