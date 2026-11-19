import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_why_now_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "about_page" ADD COLUMN "why_now_heading" varchar DEFAULT 'Why now';
  ALTER TABLE "about_page" ADD COLUMN "why_now_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "why_now_highlight_value" varchar;
  ALTER TABLE "about_page" ADD COLUMN "why_now_highlight_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "why_now_highlight_source" varchar;
  ALTER TABLE "about_page_why_now_sources" ADD CONSTRAINT "about_page_why_now_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_why_now_sources_order_idx" ON "about_page_why_now_sources" USING btree ("_order");
  CREATE INDEX "about_page_why_now_sources_parent_id_idx" ON "about_page_why_now_sources" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_why_now_sources" CASCADE;
  ALTER TABLE "about_page" DROP COLUMN "why_now_heading";
  ALTER TABLE "about_page" DROP COLUMN "why_now_text";
  ALTER TABLE "about_page" DROP COLUMN "why_now_highlight_value";
  ALTER TABLE "about_page" DROP COLUMN "why_now_highlight_text";
  ALTER TABLE "about_page" DROP COLUMN "why_now_highlight_source";`)
}
