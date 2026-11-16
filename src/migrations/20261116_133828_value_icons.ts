import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_values_items_icon" AS ENUM('action', 'equality', 'accessibility', 'growth', 'accountability', 'partnership', 'heart', 'idea', 'globe', 'learning');
  ALTER TABLE "about_page_values_items" ADD COLUMN "icon" "enum_about_page_values_items_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_values_items" DROP COLUMN "icon";
  DROP TYPE "public"."enum_about_page_values_items_icon";`)
}
