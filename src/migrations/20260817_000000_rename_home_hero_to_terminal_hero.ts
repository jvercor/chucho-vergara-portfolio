import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add new enum values — must be committed before they can be used in UPDATE
  await db.execute(sql`ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE IF NOT EXISTS 'terminalHero'`)
  await db.execute(sql`ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE IF NOT EXISTS 'terminalHero'`)
  // 2. Migrate existing data (separate statements — enum values now visible)
  await db.execute(sql`UPDATE "pages" SET "hero_type" = 'terminalHero' WHERE "hero_type" = 'homeHero'`)
  await db.execute(sql`UPDATE "_pages_v" SET "version_hero_type" = 'terminalHero' WHERE "version_hero_type" = 'homeHero'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE "pages" SET "hero_type" = 'homeHero' WHERE "hero_type" = 'terminalHero'`)
  await db.execute(sql`UPDATE "_pages_v" SET "version_hero_type" = 'homeHero' WHERE "version_hero_type" = 'terminalHero'`)
}
