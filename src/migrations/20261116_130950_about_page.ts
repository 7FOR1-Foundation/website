import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_board_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar,
  	"linkedin" varchar,
  	"show" boolean DEFAULT false
  );
  
  CREATE TABLE "about_page_objectives_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_volunteering_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_title" varchar DEFAULT 'About Us',
  	"intro_text" varchar,
  	"story_heading" varchar DEFAULT 'Our story',
  	"story_text" varchar,
  	"story_image_id" integer,
  	"story_image_caption" varchar,
  	"values_heading" varchar DEFAULT 'Our values',
  	"board_heading" varchar DEFAULT 'Our Executive Board',
  	"board_intro" varchar,
  	"objectives_heading" varchar DEFAULT 'What we work towards',
  	"objectives_intro" varchar,
  	"location_heading" varchar DEFAULT 'Where we are',
  	"location_text" varchar,
  	"volunteering_heading" varchar DEFAULT 'Ways to volunteer',
  	"volunteering_intro" varchar,
  	"closing_heading" varchar DEFAULT 'Join us',
  	"closing_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "about_page_values_items" ADD CONSTRAINT "about_page_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_board_members" ADD CONSTRAINT "about_page_board_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_objectives_items" ADD CONSTRAINT "about_page_objectives_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_volunteering_roles" ADD CONSTRAINT "about_page_volunteering_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_page_values_items_order_idx" ON "about_page_values_items" USING btree ("_order");
  CREATE INDEX "about_page_values_items_parent_id_idx" ON "about_page_values_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_board_members_order_idx" ON "about_page_board_members" USING btree ("_order");
  CREATE INDEX "about_page_board_members_parent_id_idx" ON "about_page_board_members" USING btree ("_parent_id");
  CREATE INDEX "about_page_objectives_items_order_idx" ON "about_page_objectives_items" USING btree ("_order");
  CREATE INDEX "about_page_objectives_items_parent_id_idx" ON "about_page_objectives_items" USING btree ("_parent_id");
  CREATE INDEX "about_page_volunteering_roles_order_idx" ON "about_page_volunteering_roles" USING btree ("_order");
  CREATE INDEX "about_page_volunteering_roles_parent_id_idx" ON "about_page_volunteering_roles" USING btree ("_parent_id");
  CREATE INDEX "about_page_story_story_image_idx" ON "about_page" USING btree ("story_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_values_items" CASCADE;
  DROP TABLE "about_page_board_members" CASCADE;
  DROP TABLE "about_page_objectives_items" CASCADE;
  DROP TABLE "about_page_volunteering_roles" CASCADE;
  DROP TABLE "about_page" CASCADE;`)
}
