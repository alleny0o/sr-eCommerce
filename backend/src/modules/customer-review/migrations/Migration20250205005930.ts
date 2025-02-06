import { Migration } from '@mikro-orm/migrations';

export class Migration20250205005930 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customer_review" add column if not exists "is_edited" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customer_review" drop column if exists "is_edited";`);
  }

}
