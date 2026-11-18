import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_messages_availability" AS ENUM('weekdays', 'weekends', 'evenings', 'occasional');
  CREATE TYPE "public"."enum_messages_type" AS ENUM('contact', 'volunteer', 'donation');
  CREATE TYPE "public"."enum_messages_status" AS ENUM('new', 'replied', 'done');
  CREATE TYPE "public"."enum_messages_reason" AS ENUM('question', 'partnership', 'media', 'writing', 'other');
  CREATE TYPE "public"."enum_messages_location" AS ENUM('douala', 'buea', 'cameroon', 'abroad');
  CREATE TYPE "public"."enum_messages_mode" AS ENUM('inPerson', 'online', 'both');
  CREATE TABLE "messages_availability" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_messages_availability",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_messages_type" NOT NULL,
  	"status" "enum_messages_status" DEFAULT 'new' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"reason" "enum_messages_reason",
  	"organisation" varchar,
  	"location" "enum_messages_location",
  	"skills" varchar,
  	"mode" "enum_messages_mode",
  	"access_needs" varchar,
  	"adult" boolean,
  	"campaign" varchar,
  	"amount" varchar,
  	"thank_publicly" boolean,
  	"message" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"notified" boolean,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "donate_page_campaigns_items_needs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "donate_page_campaigns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"label" varchar,
  	"text" varchar NOT NULL,
  	"raised" numeric,
  	"goal" numeric,
  	"initiative_id" integer,
  	"image_id" integer
  );
  
  CREATE TABLE "donate_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_title" varchar DEFAULT 'Donate',
  	"intro_text" varchar,
  	"campaigns_heading" varchar DEFAULT 'What your gift supports',
  	"form_heading" varchar DEFAULT 'I’d like to give',
  	"form_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "usd_rate" numeric DEFAULT 580;
  ALTER TABLE "messages_availability" ADD CONSTRAINT "messages_availability_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "messages_texts" ADD CONSTRAINT "messages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_page_campaigns_items_needs" ADD CONSTRAINT "donate_page_campaigns_items_needs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_page_campaigns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_page_campaigns_items" ADD CONSTRAINT "donate_page_campaigns_items_initiative_id_initiatives_id_fk" FOREIGN KEY ("initiative_id") REFERENCES "public"."initiatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donate_page_campaigns_items" ADD CONSTRAINT "donate_page_campaigns_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donate_page_campaigns_items" ADD CONSTRAINT "donate_page_campaigns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "messages_availability_order_idx" ON "messages_availability" USING btree ("order");
  CREATE INDEX "messages_availability_parent_idx" ON "messages_availability" USING btree ("parent_id");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX "messages_texts_order_parent" ON "messages_texts" USING btree ("order","parent_id");
  CREATE INDEX "donate_page_campaigns_items_needs_order_idx" ON "donate_page_campaigns_items_needs" USING btree ("_order");
  CREATE INDEX "donate_page_campaigns_items_needs_parent_id_idx" ON "donate_page_campaigns_items_needs" USING btree ("_parent_id");
  CREATE INDEX "donate_page_campaigns_items_order_idx" ON "donate_page_campaigns_items" USING btree ("_order");
  CREATE INDEX "donate_page_campaigns_items_parent_id_idx" ON "donate_page_campaigns_items" USING btree ("_parent_id");
  CREATE INDEX "donate_page_campaigns_items_initiative_idx" ON "donate_page_campaigns_items" USING btree ("initiative_id");
  CREATE INDEX "donate_page_campaigns_items_image_idx" ON "donate_page_campaigns_items" USING btree ("image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "messages_availability" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "messages_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donate_page_campaigns_items_needs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donate_page_campaigns_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donate_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "messages_availability" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "messages_texts" CASCADE;
  DROP TABLE "donate_page_campaigns_items_needs" CASCADE;
  DROP TABLE "donate_page_campaigns_items" CASCADE;
  DROP TABLE "donate_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  DROP INDEX "payload_locked_documents_rels_messages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "messages_id";
  ALTER TABLE "site_settings" DROP COLUMN "usd_rate";
  DROP TYPE "public"."enum_messages_availability";
  DROP TYPE "public"."enum_messages_type";
  DROP TYPE "public"."enum_messages_status";
  DROP TYPE "public"."enum_messages_reason";
  DROP TYPE "public"."enum_messages_location";
  DROP TYPE "public"."enum_messages_mode";`)
}
