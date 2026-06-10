import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_hero_code" varchar;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_hero_code_filename" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_hero_code" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_hero_code_filename" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_hero_code";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_hero_code_filename";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_hero_code";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_hero_code_filename";
  `)
}
