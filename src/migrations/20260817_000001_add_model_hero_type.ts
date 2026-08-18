import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE IF NOT EXISTS 'modelHero'`)
  await db.execute(sql`ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE IF NOT EXISTS 'modelHero'`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Postgres does not support removing enum values; no-op
}
