import { Migration } from '@mikro-orm/migrations';

export class Migration20250205000727 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "customer_review" add column if not exists "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customer_review" drop column if exists "status";`);
  }

}
