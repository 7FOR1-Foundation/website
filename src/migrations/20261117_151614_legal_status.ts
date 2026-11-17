import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page" ADD COLUMN "legal_heading" varchar DEFAULT 'Legal status';
  ALTER TABLE "about_page" ADD COLUMN "legal_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "registration_note" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "registration_date" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page" DROP COLUMN "legal_heading";
  ALTER TABLE "about_page" DROP COLUMN "legal_text";
  ALTER TABLE "site_settings" DROP COLUMN "registration_note";
  ALTER TABLE "site_settings" DROP COLUMN "registration_date";`)
}
