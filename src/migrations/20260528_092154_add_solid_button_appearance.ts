import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_featured_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"project_one_id" integer,
  	"project_two_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_featured_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"subtitle" varchar,
  	"project_one_id" integer,
  	"project_two_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"short_description" varchar,
  	"cover_image_id" integer,
  	"content" jsonb,
  	"live_url" varchar,
  	"repo_url" varchar,
  	"client_location" varchar,
  	"launch_date" timestamp(3) with time zone,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stack_id" integer
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_short_description" varchar,
  	"version_cover_image_id" integer,
  	"version_content" jsonb,
  	"version_live_url" varchar,
  	"version_repo_url" varchar,
  	"version_client_location" varchar,
  	"version_launch_date" timestamp(3) with time zone,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stack_id" integer
  );
  
  CREATE TABLE "stack" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "search_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_search_fk";
  
  DROP INDEX "payload_locked_documents_rels_search_id_idx";
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "stack_id" integer;
  ALTER TABLE "pages_blocks_featured_projects" ADD CONSTRAINT "pages_blocks_featured_projects_project_one_id_projects_id_fk" FOREIGN KEY ("project_one_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_projects" ADD CONSTRAINT "pages_blocks_featured_projects_project_two_id_projects_id_fk" FOREIGN KEY ("project_two_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_featured_projects" ADD CONSTRAINT "pages_blocks_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD CONSTRAINT "_pages_v_blocks_featured_projects_project_one_id_projects_id_fk" FOREIGN KEY ("project_one_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD CONSTRAINT "_pages_v_blocks_featured_projects_project_two_id_projects_id_fk" FOREIGN KEY ("project_two_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_featured_projects" ADD CONSTRAINT "_pages_v_blocks_featured_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_stack_fk" FOREIGN KEY ("stack_id") REFERENCES "public"."stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_stack_fk" FOREIGN KEY ("stack_id") REFERENCES "public"."stack"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_featured_projects_order_idx" ON "pages_blocks_featured_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_featured_projects_parent_id_idx" ON "pages_blocks_featured_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_featured_projects_path_idx" ON "pages_blocks_featured_projects" USING btree ("_path");
  CREATE INDEX "pages_blocks_featured_projects_project_one_idx" ON "pages_blocks_featured_projects" USING btree ("project_one_id");
  CREATE INDEX "pages_blocks_featured_projects_project_two_idx" ON "pages_blocks_featured_projects" USING btree ("project_two_id");
  CREATE INDEX "_pages_v_blocks_featured_projects_order_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_featured_projects_parent_id_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_featured_projects_path_idx" ON "_pages_v_blocks_featured_projects" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_featured_projects_project_one_idx" ON "_pages_v_blocks_featured_projects" USING btree ("project_one_id");
  CREATE INDEX "_pages_v_blocks_featured_projects_project_two_idx" ON "_pages_v_blocks_featured_projects" USING btree ("project_two_id");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_stack_id_idx" ON "projects_rels" USING btree ("stack_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_cover_image_idx" ON "_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_stack_id_idx" ON "_projects_v_rels" USING btree ("stack_id");
  CREATE INDEX "stack_updated_at_idx" ON "stack" USING btree ("updated_at");
  CREATE INDEX "stack_created_at_idx" ON "stack" USING btree ("created_at");
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stack_fk" FOREIGN KEY ("stack_id") REFERENCES "public"."stack"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_background_image_idx" ON "pages_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_cta_background_image_idx" ON "_pages_v_blocks_cta" USING btree ("background_image_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_stack_id_idx" ON "payload_locked_documents_rels" USING btree ("stack_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  ALTER TABLE "pages_blocks_featured_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_featured_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "stack" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_featured_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_featured_projects" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "stack" CASCADE;
  ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_background_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta" DROP CONSTRAINT "_pages_v_blocks_cta_background_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_stack_fk";
  
  DROP INDEX "pages_blocks_cta_background_image_idx";
  DROP INDEX "_pages_v_blocks_cta_background_image_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_stack_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" integer;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "background_image_id";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "background_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "stack_id";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";`)
}
