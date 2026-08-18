import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-vercel-postgres'

// Applied manually on Neon dashboard — ALTER TYPE cannot run inside a Payload
// transaction and be used in the same transaction. Enum values were applied
// directly via SQL on the live DB.
export async function up(_args: MigrateUpArgs): Promise<void> {}

export async function down(_args: MigrateDownArgs): Promise<void> {}
