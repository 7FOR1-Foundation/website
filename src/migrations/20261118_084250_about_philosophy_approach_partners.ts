import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_partners_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"link" varchar,
  	"text" varchar,
  	"logo_id" integer,
  	"show" boolean DEFAULT false
  );
  
  ALTER TABLE "about_page" ALTER COLUMN "objectives_heading" SET DEFAULT 'Our approach';
  ALTER TABLE "about_page_objectives_items" ADD COLUMN "title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "philosophy_heading" varchar DEFAULT 'Action Over Sympathy';
  ALTER TABLE "about_page" ADD COLUMN "philosophy_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "partners_heading" varchar DEFAULT 'Our partners';
  ALTER TABLE "about_page" ADD COLUMN "partners_intro" varchar;
  ALTER TABLE "about_page_partners_items" ADD CONSTRAINT "about_page_partners_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_partners_items" ADD CONSTRAINT "about_page_partners_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_partners_items_order_idx" ON "about_page_partners_items" USING btree ("_order");
  CREATE INDEX "about_page_partners_items_parent_id_idx" ON "about_page_partners_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_partners_items_logo_idx" ON "about_page_partners_items" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_partners_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_page_partners_items" CASCADE;
  ALTER TABLE "about_page" ALTER COLUMN "objectives_heading" SET DEFAULT 'What we work towards';
  ALTER TABLE "about_page_objectives_items" DROP COLUMN "title";
  ALTER TABLE "about_page" DROP COLUMN "philosophy_heading";
  ALTER TABLE "about_page" DROP COLUMN "philosophy_text";
  ALTER TABLE "about_page" DROP COLUMN "partners_heading";
  ALTER TABLE "about_page" DROP COLUMN "partners_intro";`)
}
