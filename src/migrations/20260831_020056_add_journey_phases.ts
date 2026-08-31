import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "journey_phases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"start_year" numeric NOT NULL,
  	"is_current" boolean DEFAULT false,
  	"end_year" numeric,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "journey_phases_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stack_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "journey_phases_id" integer;
  ALTER TABLE "journey_phases_rels" ADD CONSTRAINT "journey_phases_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journey_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journey_phases_rels" ADD CONSTRAINT "journey_phases_rels_stack_fk" FOREIGN KEY ("stack_id") REFERENCES "public"."stack"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "journey_phases_updated_at_idx" ON "journey_phases" USING btree ("updated_at");
  CREATE INDEX "journey_phases_created_at_idx" ON "journey_phases" USING btree ("created_at");
  CREATE INDEX "journey_phases_rels_order_idx" ON "journey_phases_rels" USING btree ("order");
  CREATE INDEX "journey_phases_rels_parent_idx" ON "journey_phases_rels" USING btree ("parent_id");
  CREATE INDEX "journey_phases_rels_path_idx" ON "journey_phases_rels" USING btree ("path");
  CREATE INDEX "journey_phases_rels_stack_id_idx" ON "journey_phases_rels" USING btree ("stack_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journey_phases_fk" FOREIGN KEY ("journey_phases_id") REFERENCES "public"."journey_phases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_journey_phases_id_idx" ON "payload_locked_documents_rels" USING btree ("journey_phases_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "journey_phases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "journey_phases_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "journey_phases" CASCADE;
  DROP TABLE "journey_phases_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_journey_phases_fk";
  DROP INDEX "payload_locked_documents_rels_journey_phases_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "journey_phases_id";`)
}
