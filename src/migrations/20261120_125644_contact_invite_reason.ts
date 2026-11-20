import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_messages_reason" ADD VALUE 'invite' BEFORE 'other';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "messages" ALTER COLUMN "reason" SET DATA TYPE text;
  DROP TYPE "public"."enum_messages_reason";
  CREATE TYPE "public"."enum_messages_reason" AS ENUM('question', 'partnership', 'media', 'writing', 'other');
  ALTER TABLE "messages" ALTER COLUMN "reason" SET DATA TYPE "public"."enum_messages_reason" USING "reason"::"public"."enum_messages_reason";`)
}
