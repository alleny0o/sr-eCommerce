import { Migration } from '@mikro-orm/migrations';

export class Migration20250204234640 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customer_review_image" drop constraint if exists "customer_review_image_file_id_unique";`);
    this.addSql(`create table if not exists "customer_review" ("id" text not null, "product_id" text not null, "customer_id" text not null, "rating" integer not null, "title" text not null, "comment" text not null, "recommend" boolean not null default true, "total_upvotes" integer not null default 0, "total_downvotes" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_review_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_review_deleted_at" ON "customer_review" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customer_review_image" ("id" text not null, "file_id" text not null, "name" text not null, "size" integer not null, "mime_type" text not null, "url" text not null, "customer_review_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_review_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_review_image_file_id_unique" ON "customer_review_image" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_review_image_customer_review_id" ON "customer_review_image" (customer_review_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_review_image_deleted_at" ON "customer_review_image" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customer_review_vote" ("id" text not null, "customer_id" text not null, "vote" text check ("vote" in ('upvote', 'downvote')) not null, "customer_review_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_review_vote_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_review_vote_customer_review_id" ON "customer_review_vote" (customer_review_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_review_vote_deleted_at" ON "customer_review_vote" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "customer_review_image" add constraint "customer_review_image_customer_review_id_foreign" foreign key ("customer_review_id") references "customer_review" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "customer_review_vote" add constraint "customer_review_vote_customer_review_id_foreign" foreign key ("customer_review_id") references "customer_review" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customer_review_image" drop constraint if exists "customer_review_image_customer_review_id_foreign";`);

    this.addSql(`alter table if exists "customer_review_vote" drop constraint if exists "customer_review_vote_customer_review_id_foreign";`);

    this.addSql(`drop table if exists "customer_review" cascade;`);

    this.addSql(`drop table if exists "customer_review_image" cascade;`);

    this.addSql(`drop table if exists "customer_review_vote" cascade;`);
  }

}
