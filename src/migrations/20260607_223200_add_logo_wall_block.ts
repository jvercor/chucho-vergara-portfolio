import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_logo_wall_logos" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "svg" text
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_logo_wall" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar,
      "subtitle" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_wall_logos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "svg" text,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_logo_wall" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar,
      "subtitle" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_logo_wall_logos_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_logo_wall_logos"
          ADD CONSTRAINT "pages_blocks_logo_wall_logos_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_wall"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'pages_blocks_logo_wall_parent_id_fk'
      ) THEN
        ALTER TABLE "pages_blocks_logo_wall"
          ADD CONSTRAINT "pages_blocks_logo_wall_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_logo_wall_logos_parent_id_fk'
      ) THEN
        ALTER TABLE "_pages_v_blocks_logo_wall_logos"
          ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_wall"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_blocks_logo_wall_parent_id_fk'
      ) THEN
        ALTER TABLE "_pages_v_blocks_logo_wall"
          ADD CONSTRAINT "_pages_v_blocks_logo_wall_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_logo_wall_logos_order_idx"
      ON "pages_blocks_logo_wall_logos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_logo_wall_logos_parent_id_idx"
      ON "pages_blocks_logo_wall_logos" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "pages_blocks_logo_wall_order_idx"
      ON "pages_blocks_logo_wall" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_logo_wall_parent_id_idx"
      ON "pages_blocks_logo_wall" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_logo_wall_path_idx"
      ON "pages_blocks_logo_wall" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_wall_logos_order_idx"
      ON "_pages_v_blocks_logo_wall_logos" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_wall_logos_parent_id_idx"
      ON "_pages_v_blocks_logo_wall_logos" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_wall_order_idx"
      ON "_pages_v_blocks_logo_wall" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_wall_parent_id_idx"
      ON "_pages_v_blocks_logo_wall" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_logo_wall_path_idx"
      ON "_pages_v_blocks_logo_wall" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_logo_wall_logos" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_logo_wall" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_logo_wall_logos" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_logo_wall" CASCADE;
  `)
}
