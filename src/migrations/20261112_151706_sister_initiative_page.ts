import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "initiatives_sister_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "initiatives_sister_appeal_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "initiatives_sister_provides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "initiatives_sister_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "initiatives_sister_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "initiatives_sister_funding_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" numeric,
  	"detail" varchar
  );
  
  CREATE TABLE "initiatives_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_initiatives_v_version_sister_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_sister_appeal_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_sister_provides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_sister_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_sister_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_sister_funding_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"amount" numeric,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "initiatives" ADD COLUMN "external_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_logo_id" integer;
  ALTER TABLE "initiatives" ADD COLUMN "sister_tagline" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_dark_colour" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_main_colour" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_accent_colour" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_highlight_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_highlight_title" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_highlight_text" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_highlight_image_id" integer;
  ALTER TABLE "initiatives" ADD COLUMN "sister_highlight_image_caption" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_appeal_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_appeal_title" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_appeal_text" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_appeal_button_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_appeal_button_link" varchar DEFAULT '/contact';
  ALTER TABLE "initiatives" ADD COLUMN "sister_quote" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_funding_period" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_funding_raised" numeric;
  ALTER TABLE "initiatives" ADD COLUMN "sister_funding_currency" varchar DEFAULT 'FCFA';
  ALTER TABLE "initiatives" ADD COLUMN "sister_funding_note" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_sponsors_text" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_next_text" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_name_note" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_external_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_logo_id" integer;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_tagline" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_dark_colour" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_main_colour" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_accent_colour" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_highlight_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_highlight_title" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_highlight_text" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_highlight_image_id" integer;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_highlight_image_caption" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_appeal_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_appeal_title" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_appeal_text" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_appeal_button_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_appeal_button_link" varchar DEFAULT '/contact';
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_quote" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_funding_period" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_funding_raised" numeric;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_funding_currency" varchar DEFAULT 'FCFA';
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_funding_note" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_sponsors_text" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_next_text" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_name_note" varchar;
  ALTER TABLE "initiatives_sister_stats" ADD CONSTRAINT "initiatives_sister_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_sister_appeal_figures" ADD CONSTRAINT "initiatives_sister_appeal_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_sister_provides" ADD CONSTRAINT "initiatives_sister_provides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_sister_steps" ADD CONSTRAINT "initiatives_sister_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_sister_timeline" ADD CONSTRAINT "initiatives_sister_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_sister_funding_items" ADD CONSTRAINT "initiatives_sister_funding_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_rels" ADD CONSTRAINT "initiatives_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_rels" ADD CONSTRAINT "initiatives_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_sister_stats" ADD CONSTRAINT "_initiatives_v_version_sister_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_sister_appeal_figures" ADD CONSTRAINT "_initiatives_v_version_sister_appeal_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_sister_provides" ADD CONSTRAINT "_initiatives_v_version_sister_provides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_sister_steps" ADD CONSTRAINT "_initiatives_v_version_sister_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_sister_timeline" ADD CONSTRAINT "_initiatives_v_version_sister_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_sister_funding_items" ADD CONSTRAINT "_initiatives_v_version_sister_funding_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_rels" ADD CONSTRAINT "_initiatives_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_rels" ADD CONSTRAINT "_initiatives_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "initiatives_sister_stats_order_idx" ON "initiatives_sister_stats" USING btree ("_order");
  CREATE INDEX "initiatives_sister_stats_parent_id_idx" ON "initiatives_sister_stats" USING btree ("_parent_id");
  CREATE INDEX "initiatives_sister_appeal_figures_order_idx" ON "initiatives_sister_appeal_figures" USING btree ("_order");
  CREATE INDEX "initiatives_sister_appeal_figures_parent_id_idx" ON "initiatives_sister_appeal_figures" USING btree ("_parent_id");
  CREATE INDEX "initiatives_sister_provides_order_idx" ON "initiatives_sister_provides" USING btree ("_order");
  CREATE INDEX "initiatives_sister_provides_parent_id_idx" ON "initiatives_sister_provides" USING btree ("_parent_id");
  CREATE INDEX "initiatives_sister_steps_order_idx" ON "initiatives_sister_steps" USING btree ("_order");
  CREATE INDEX "initiatives_sister_steps_parent_id_idx" ON "initiatives_sister_steps" USING btree ("_parent_id");
  CREATE INDEX "initiatives_sister_timeline_order_idx" ON "initiatives_sister_timeline" USING btree ("_order");
  CREATE INDEX "initiatives_sister_timeline_parent_id_idx" ON "initiatives_sister_timeline" USING btree ("_parent_id");
  CREATE INDEX "initiatives_sister_funding_items_order_idx" ON "initiatives_sister_funding_items" USING btree ("_order");
  CREATE INDEX "initiatives_sister_funding_items_parent_id_idx" ON "initiatives_sister_funding_items" USING btree ("_parent_id");
  CREATE INDEX "initiatives_rels_order_idx" ON "initiatives_rels" USING btree ("order");
  CREATE INDEX "initiatives_rels_parent_idx" ON "initiatives_rels" USING btree ("parent_id");
  CREATE INDEX "initiatives_rels_path_idx" ON "initiatives_rels" USING btree ("path");
  CREATE INDEX "initiatives_rels_media_id_idx" ON "initiatives_rels" USING btree ("media_id");
  CREATE INDEX "_initiatives_v_version_sister_stats_order_idx" ON "_initiatives_v_version_sister_stats" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_sister_stats_parent_id_idx" ON "_initiatives_v_version_sister_stats" USING btree ("_parent_id");
  CREATE INDEX "_initiatives_v_version_sister_appeal_figures_order_idx" ON "_initiatives_v_version_sister_appeal_figures" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_sister_appeal_figures_parent_id_idx" ON "_initiatives_v_version_sister_appeal_figures" USING btree ("_parent_id");
  CREATE INDEX "_initiatives_v_version_sister_provides_order_idx" ON "_initiatives_v_version_sister_provides" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_sister_provides_parent_id_idx" ON "_initiatives_v_version_sister_provides" USING btree ("_parent_id");
  CREATE INDEX "_initiatives_v_version_sister_steps_order_idx" ON "_initiatives_v_version_sister_steps" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_sister_steps_parent_id_idx" ON "_initiatives_v_version_sister_steps" USING btree ("_parent_id");
  CREATE INDEX "_initiatives_v_version_sister_timeline_order_idx" ON "_initiatives_v_version_sister_timeline" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_sister_timeline_parent_id_idx" ON "_initiatives_v_version_sister_timeline" USING btree ("_parent_id");
  CREATE INDEX "_initiatives_v_version_sister_funding_items_order_idx" ON "_initiatives_v_version_sister_funding_items" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_sister_funding_items_parent_id_idx" ON "_initiatives_v_version_sister_funding_items" USING btree ("_parent_id");
  CREATE INDEX "_initiatives_v_rels_order_idx" ON "_initiatives_v_rels" USING btree ("order");
  CREATE INDEX "_initiatives_v_rels_parent_idx" ON "_initiatives_v_rels" USING btree ("parent_id");
  CREATE INDEX "_initiatives_v_rels_path_idx" ON "_initiatives_v_rels" USING btree ("path");
  CREATE INDEX "_initiatives_v_rels_media_id_idx" ON "_initiatives_v_rels" USING btree ("media_id");
  ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_sister_logo_id_media_id_fk" FOREIGN KEY ("sister_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_sister_highlight_image_id_media_id_fk" FOREIGN KEY ("sister_highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_initiatives_v" ADD CONSTRAINT "_initiatives_v_version_sister_logo_id_media_id_fk" FOREIGN KEY ("version_sister_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_initiatives_v" ADD CONSTRAINT "_initiatives_v_version_sister_highlight_image_id_media_id_fk" FOREIGN KEY ("version_sister_highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "initiatives_sister_sister_logo_idx" ON "initiatives" USING btree ("sister_logo_id");
  CREATE INDEX "initiatives_sister_highlight_sister_highlight_image_idx" ON "initiatives" USING btree ("sister_highlight_image_id");
  CREATE INDEX "_initiatives_v_version_sister_version_sister_logo_idx" ON "_initiatives_v" USING btree ("version_sister_logo_id");
  CREATE INDEX "_initiatives_v_version_sister_highlight_version_sister_h_idx" ON "_initiatives_v" USING btree ("version_sister_highlight_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives_sister_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "initiatives_sister_appeal_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "initiatives_sister_provides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "initiatives_sister_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "initiatives_sister_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "initiatives_sister_funding_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "initiatives_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_version_sister_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_version_sister_appeal_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_version_sister_provides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_version_sister_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_version_sister_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_version_sister_funding_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_initiatives_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "initiatives_sister_stats" CASCADE;
  DROP TABLE "initiatives_sister_appeal_figures" CASCADE;
  DROP TABLE "initiatives_sister_provides" CASCADE;
  DROP TABLE "initiatives_sister_steps" CASCADE;
  DROP TABLE "initiatives_sister_timeline" CASCADE;
  DROP TABLE "initiatives_sister_funding_items" CASCADE;
  DROP TABLE "initiatives_rels" CASCADE;
  DROP TABLE "_initiatives_v_version_sister_stats" CASCADE;
  DROP TABLE "_initiatives_v_version_sister_appeal_figures" CASCADE;
  DROP TABLE "_initiatives_v_version_sister_provides" CASCADE;
  DROP TABLE "_initiatives_v_version_sister_steps" CASCADE;
  DROP TABLE "_initiatives_v_version_sister_timeline" CASCADE;
  DROP TABLE "_initiatives_v_version_sister_funding_items" CASCADE;
  DROP TABLE "_initiatives_v_rels" CASCADE;
  ALTER TABLE "initiatives" DROP CONSTRAINT "initiatives_sister_logo_id_media_id_fk";
  
  ALTER TABLE "initiatives" DROP CONSTRAINT "initiatives_sister_highlight_image_id_media_id_fk";
  
  ALTER TABLE "_initiatives_v" DROP CONSTRAINT "_initiatives_v_version_sister_logo_id_media_id_fk";
  
  ALTER TABLE "_initiatives_v" DROP CONSTRAINT "_initiatives_v_version_sister_highlight_image_id_media_id_fk";
  
  DROP INDEX "initiatives_sister_sister_logo_idx";
  DROP INDEX "initiatives_sister_highlight_sister_highlight_image_idx";
  DROP INDEX "_initiatives_v_version_sister_version_sister_logo_idx";
  DROP INDEX "_initiatives_v_version_sister_highlight_version_sister_h_idx";
  ALTER TABLE "initiatives" DROP COLUMN "external_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_logo_id";
  ALTER TABLE "initiatives" DROP COLUMN "sister_tagline";
  ALTER TABLE "initiatives" DROP COLUMN "sister_dark_colour";
  ALTER TABLE "initiatives" DROP COLUMN "sister_main_colour";
  ALTER TABLE "initiatives" DROP COLUMN "sister_accent_colour";
  ALTER TABLE "initiatives" DROP COLUMN "sister_highlight_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_highlight_title";
  ALTER TABLE "initiatives" DROP COLUMN "sister_highlight_text";
  ALTER TABLE "initiatives" DROP COLUMN "sister_highlight_image_id";
  ALTER TABLE "initiatives" DROP COLUMN "sister_highlight_image_caption";
  ALTER TABLE "initiatives" DROP COLUMN "sister_appeal_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_appeal_title";
  ALTER TABLE "initiatives" DROP COLUMN "sister_appeal_text";
  ALTER TABLE "initiatives" DROP COLUMN "sister_appeal_button_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_appeal_button_link";
  ALTER TABLE "initiatives" DROP COLUMN "sister_quote";
  ALTER TABLE "initiatives" DROP COLUMN "sister_funding_period";
  ALTER TABLE "initiatives" DROP COLUMN "sister_funding_raised";
  ALTER TABLE "initiatives" DROP COLUMN "sister_funding_currency";
  ALTER TABLE "initiatives" DROP COLUMN "sister_funding_note";
  ALTER TABLE "initiatives" DROP COLUMN "sister_sponsors_text";
  ALTER TABLE "initiatives" DROP COLUMN "sister_next_text";
  ALTER TABLE "initiatives" DROP COLUMN "sister_name_note";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_external_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_logo_id";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_tagline";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_dark_colour";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_main_colour";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_accent_colour";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_highlight_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_highlight_title";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_highlight_text";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_highlight_image_id";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_highlight_image_caption";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_appeal_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_appeal_title";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_appeal_text";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_appeal_button_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_appeal_button_link";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_quote";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_funding_period";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_funding_raised";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_funding_currency";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_funding_note";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_sponsors_text";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_next_text";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_name_note";`)
}
