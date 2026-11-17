import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "email_subscribers" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "emailed_at" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_email_subscribers" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_emailed_at" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "brevo_synced" boolean DEFAULT false;
  ALTER TABLE "subscribers" ADD COLUMN "confirm_token_hash" varchar;
  ALTER TABLE "subscribers" ADD COLUMN "confirm_sent_at" timestamp(3) with time zone;
  CREATE INDEX "subscribers_confirm_token_hash_idx" ON "subscribers" USING btree ("confirm_token_hash");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "subscribers_confirm_token_hash_idx";
  ALTER TABLE "posts" DROP COLUMN "email_subscribers";
  ALTER TABLE "posts" DROP COLUMN "emailed_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_email_subscribers";
  ALTER TABLE "_posts_v" DROP COLUMN "version_emailed_at";
  ALTER TABLE "subscribers" DROP COLUMN "brevo_synced";
  ALTER TABLE "subscribers" DROP COLUMN "confirm_token_hash";
  ALTER TABLE "subscribers" DROP COLUMN "confirm_sent_at";`)
}
