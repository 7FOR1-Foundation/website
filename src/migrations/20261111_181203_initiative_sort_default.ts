import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" ALTER COLUMN "sort_order" SET DEFAULT 99;
  ALTER TABLE "_initiatives_v" ALTER COLUMN "version_sort_order" SET DEFAULT 99;
  ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" ALTER COLUMN "sort_order" SET DEFAULT 0;
  ALTER TABLE "_initiatives_v" ALTER COLUMN "version_sort_order" SET DEFAULT 0;
  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;`)
}
