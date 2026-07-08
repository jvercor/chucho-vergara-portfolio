import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_stack_category" AS ENUM('programming-language', 'framework', 'infrastructure', 'database');
    CREATE TYPE "public"."enum_languages_level" AS ENUM('native', 'fluent', 'advanced', 'intermediate', 'basic');

    CREATE TABLE "experience_bullets" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "content" jsonb
    );

    CREATE TABLE "experience" (
      "id" serial PRIMARY KEY NOT NULL,
      "company" varchar NOT NULL,
      "company_url" varchar,
      "role" varchar NOT NULL,
      "start_year" numeric NOT NULL,
      "is_current" boolean DEFAULT false,
      "end_year" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "experience_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "stack_id" integer
    );

    CREATE TABLE "education" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "institution" varchar NOT NULL,
      "year_from" numeric NOT NULL,
      "is_current" boolean DEFAULT false,
      "year_to" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "certifications" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "institution" varchar NOT NULL,
      "note" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "languages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "level" "enum_languages_level" NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "stack" ADD COLUMN "category" "enum_stack_category";
    ALTER TABLE "stack" ADD COLUMN "subtitle" varchar;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "experience_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "education_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "certifications_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "languages_id" integer;

    ALTER TABLE "experience_bullets"
      ADD CONSTRAINT "experience_bullets_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."experience"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "experience_rels"
      ADD CONSTRAINT "experience_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."experience"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "experience_rels"
      ADD CONSTRAINT "experience_rels_stack_fk"
      FOREIGN KEY ("stack_id") REFERENCES "public"."stack"("id")
      ON DELETE cascade ON UPDATE no action;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_experience_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_experience_fk"
          FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_education_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_education_fk"
          FOREIGN KEY ("education_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_certifications_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_certifications_fk"
          FOREIGN KEY ("certifications_id") REFERENCES "public"."certifications"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_languages_fk') THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_languages_fk"
          FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX "experience_bullets_order_idx" ON "experience_bullets" USING btree ("_order");
    CREATE INDEX "experience_bullets_parent_id_idx" ON "experience_bullets" USING btree ("_parent_id");
    CREATE INDEX "experience_updated_at_idx" ON "experience" USING btree ("updated_at");
    CREATE INDEX "experience_created_at_idx" ON "experience" USING btree ("created_at");
    CREATE INDEX "experience_rels_order_idx" ON "experience_rels" USING btree ("order");
    CREATE INDEX "experience_rels_parent_idx" ON "experience_rels" USING btree ("parent_id");
    CREATE INDEX "experience_rels_path_idx" ON "experience_rels" USING btree ("path");
    CREATE INDEX "experience_rels_stack_id_idx" ON "experience_rels" USING btree ("stack_id");
    CREATE INDEX "education_updated_at_idx" ON "education" USING btree ("updated_at");
    CREATE INDEX "education_created_at_idx" ON "education" USING btree ("created_at");
    CREATE INDEX "certifications_updated_at_idx" ON "certifications" USING btree ("updated_at");
    CREATE INDEX "certifications_created_at_idx" ON "certifications" USING btree ("created_at");
    CREATE INDEX "languages_updated_at_idx" ON "languages" USING btree ("updated_at");
    CREATE INDEX "languages_created_at_idx" ON "languages" USING btree ("created_at");
    CREATE INDEX "payload_locked_documents_rels_experience_id_idx"
      ON "payload_locked_documents_rels" USING btree ("experience_id");
    CREATE INDEX "payload_locked_documents_rels_education_id_idx"
      ON "payload_locked_documents_rels" USING btree ("education_id");
    CREATE INDEX "payload_locked_documents_rels_certifications_id_idx"
      ON "payload_locked_documents_rels" USING btree ("certifications_id");
    CREATE INDEX "payload_locked_documents_rels_languages_id_idx"
      ON "payload_locked_documents_rels" USING btree ("languages_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "experience_bullets" CASCADE;
    DROP TABLE IF EXISTS "experience_rels" CASCADE;
    DROP TABLE IF EXISTS "experience" CASCADE;
    DROP TABLE IF EXISTS "education" CASCADE;
    DROP TABLE IF EXISTS "certifications" CASCADE;
    DROP TABLE IF EXISTS "languages" CASCADE;

    ALTER TABLE "stack" DROP COLUMN IF EXISTS "category";
    ALTER TABLE "stack" DROP COLUMN IF EXISTS "subtitle";

    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "experience_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "education_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "certifications_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "languages_id";

    DROP INDEX IF EXISTS "payload_locked_documents_rels_experience_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_education_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_certifications_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_languages_id_idx";

    DROP TYPE IF EXISTS "public"."enum_stack_category";
    DROP TYPE IF EXISTS "public"."enum_languages_level";
  `)
}
