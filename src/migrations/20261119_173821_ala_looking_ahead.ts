import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" ADD COLUMN "sister_vision_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_vision_heading" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_vision_text" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_vision_link_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_vision_link_url" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_vision_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_vision_heading" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_vision_text" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_vision_link_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_vision_link_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" DROP COLUMN "sister_vision_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_vision_heading";
  ALTER TABLE "initiatives" DROP COLUMN "sister_vision_text";
  ALTER TABLE "initiatives" DROP COLUMN "sister_vision_link_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_vision_link_url";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_vision_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_vision_heading";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_vision_text";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_vision_link_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_vision_link_url";`)
}
