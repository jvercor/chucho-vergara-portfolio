import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_download_file_id" integer;
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_download_label" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_download_file_id" integer;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_hero_download_label" varchar;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_hero_download_file_id_media_id_fk'
      ) THEN
        ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_download_file_id_media_id_fk"
          FOREIGN KEY ("hero_download_file_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_version_hero_download_file_id_media_id_fk'
      ) THEN
        ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_download_file_id_media_id_fk"
          FOREIGN KEY ("version_hero_download_file_id") REFERENCES "public"."media"("id")
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_hero_download_file_idx"
      ON "pages" USING btree ("hero_download_file_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_hero_download_file_idx"
      ON "_pages_v" USING btree ("version_hero_download_file_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "pages_hero_download_file_idx";
    DROP INDEX IF EXISTS "_pages_v_version_hero_download_file_idx";
    ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_download_file_id_media_id_fk";
    ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_hero_download_file_id_media_id_fk";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_download_file_id";
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_download_label";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_download_file_id";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_hero_download_label";
  `)
}
