import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "timing" varchar;
  ALTER TABLE "projects" ADD COLUMN "audience" varchar;
  ALTER TABLE "projects" ADD COLUMN "funding_goal" numeric;
  ALTER TABLE "projects" ADD COLUMN "funding_raised" numeric;
  ALTER TABLE "projects" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "projects" ADD COLUMN "cta_link" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_timing" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_audience" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_funding_goal" numeric;
  ALTER TABLE "_projects_v" ADD COLUMN "version_funding_raised" numeric;
  ALTER TABLE "_projects_v" ADD COLUMN "version_cta_label" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_cta_link" varchar;
  ALTER TABLE "donate_page_campaigns_items" ADD COLUMN "project_id" integer;
  ALTER TABLE "donate_page_campaigns_items" ADD CONSTRAINT "donate_page_campaigns_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "donate_page_campaigns_items_project_idx" ON "donate_page_campaigns_items" USING btree ("project_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donate_page_campaigns_items" DROP CONSTRAINT "donate_page_campaigns_items_project_id_projects_id_fk";
  
  DROP INDEX "donate_page_campaigns_items_project_idx";
  ALTER TABLE "projects" DROP COLUMN "timing";
  ALTER TABLE "projects" DROP COLUMN "audience";
  ALTER TABLE "projects" DROP COLUMN "funding_goal";
  ALTER TABLE "projects" DROP COLUMN "funding_raised";
  ALTER TABLE "projects" DROP COLUMN "cta_label";
  ALTER TABLE "projects" DROP COLUMN "cta_link";
  ALTER TABLE "_projects_v" DROP COLUMN "version_timing";
  ALTER TABLE "_projects_v" DROP COLUMN "version_audience";
  ALTER TABLE "_projects_v" DROP COLUMN "version_funding_goal";
  ALTER TABLE "_projects_v" DROP COLUMN "version_funding_raised";
  ALTER TABLE "_projects_v" DROP COLUMN "version_cta_label";
  ALTER TABLE "_projects_v" DROP COLUMN "version_cta_link";
  ALTER TABLE "donate_page_campaigns_items" DROP COLUMN "project_id";`)
}
