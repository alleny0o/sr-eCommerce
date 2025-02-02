import { Migration } from '@mikro-orm/migrations';

export class Migration20250202041725 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "option_image" drop constraint if exists "option_image_option_variation_id_unique";`);
    this.addSql(`alter table if exists "option_image" drop constraint if exists "option_image_file_id_unique";`);
    this.addSql(`alter table if exists "option_variation" drop constraint if exists "option_variation_variation_id_unique";`);
    this.addSql(`alter table if exists "option_extension" drop constraint if exists "option_extension_option_id_unique";`);
    this.addSql(`create table if not exists "option_extension" ("id" text not null, "product_id" text not null, "option_id" text not null, "option_title" text not null, "display_type" text check ("display_type" in ('buttons', 'dropdown', 'colors', 'images')) not null default 'buttons', "is_selected" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_extension_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_extension_option_id_unique" ON "option_extension" (option_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_extension_deleted_at" ON "option_extension" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "option_variation" ("id" text not null, "variation_id" text not null, "color" text null, "option_extension_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_variation_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_variation_variation_id_unique" ON "option_variation" (variation_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_variation_option_extension_id" ON "option_variation" (option_extension_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_variation_deleted_at" ON "option_variation" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "option_image" ("id" text not null, "file_id" text not null, "name" text not null, "size" integer not null, "mime_type" text not null, "url" text not null, "option_variation_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "option_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_image_file_id_unique" ON "option_image" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_image_option_variation_id_unique" ON "option_image" (option_variation_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_option_image_deleted_at" ON "option_image" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "option_variation" add constraint "option_variation_option_extension_id_foreign" foreign key ("option_extension_id") references "option_extension" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "option_image" add constraint "option_image_option_variation_id_foreign" foreign key ("option_variation_id") references "option_variation" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "option_variation" drop constraint if exists "option_variation_option_extension_id_foreign";`);

    this.addSql(`alter table if exists "option_image" drop constraint if exists "option_image_option_variation_id_foreign";`);

    this.addSql(`drop table if exists "option_extension" cascade;`);

    this.addSql(`drop table if exists "option_variation" cascade;`);

    this.addSql(`drop table if exists "option_image" cascade;`);
  }

}
