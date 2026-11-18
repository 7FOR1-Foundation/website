import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" ADD COLUMN "sister_next_button_label" varchar;
  ALTER TABLE "initiatives" ADD COLUMN "sister_next_button_link" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_next_button_label" varchar;
  ALTER TABLE "_initiatives_v" ADD COLUMN "version_sister_next_button_link" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" DROP COLUMN "sister_next_button_label";
  ALTER TABLE "initiatives" DROP COLUMN "sister_next_button_link";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_next_button_label";
  ALTER TABLE "_initiatives_v" DROP COLUMN "version_sister_next_button_link";`)
}
