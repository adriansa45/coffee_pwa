import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	// We use separate try/catch blocks for robustness as some parts might already exist
	try {
		await db.execute(sql`CREATE TABLE IF NOT EXISTS "media" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric,
      "sizes_thumbnail_url" varchar,
      "sizes_thumbnail_width" numeric,
      "sizes_thumbnail_height" numeric,
      "sizes_thumbnail_mime_type" varchar,
      "sizes_thumbnail_filesize" numeric,
      "sizes_thumbnail_filename" varchar,
      "sizes_card_url" varchar,
      "sizes_card_width" numeric,
      "sizes_card_height" numeric,
      "sizes_card_mime_type" varchar,
      "sizes_card_filesize" numeric,
      "sizes_card_filename" varchar,
      "sizes_tablet_url" varchar,
      "sizes_tablet_width" numeric,
      "sizes_tablet_height" numeric,
      "sizes_tablet_mime_type" varchar,
      "sizes_tablet_filesize" numeric,
      "sizes_tablet_filename" varchar
    );`)
	} catch (e) { }

	try {
		await db.execute(sql`CREATE TABLE IF NOT EXISTS "coffee_shops_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" varchar NOT NULL,
      "path" varchar NOT NULL,
      "media_id" integer
    );`)
	} catch (e) { }

	try { await db.execute(sql`ALTER TABLE "coffee_shops" ADD COLUMN IF NOT EXISTS "main_image_id" integer;`); } catch (e) { }
	try { await db.execute(sql`ALTER TABLE "coffee_shops" ADD COLUMN IF NOT EXISTS "phone" varchar;`); } catch (e) { }
	try { await db.execute(sql`ALTER TABLE "coffee_shops" ADD COLUMN IF NOT EXISTS "website" varchar;`); } catch (e) { }
	try { await db.execute(sql`ALTER TABLE "coffee_shops" ADD COLUMN IF NOT EXISTS "hours" jsonb;`); } catch (e) { }
	try { await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "brand_color" varchar DEFAULT '#820E2B';`); } catch (e) { }
	try { await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;`); } catch (e) { }

	try { await db.execute(sql`ALTER TABLE "coffee_shops" ALTER COLUMN "description" SET DATA TYPE jsonb;`); } catch (e) { }

	// Indexes
	try { await db.execute(sql`CREATE INDEX IF NOT EXISTS "coffee_shops_main_image_idx" ON "coffee_shops" ("main_image_id");`); } catch (e) { }
	try { await db.execute(sql`CREATE INDEX IF NOT EXISTS "media_filename_idx" ON "media" ("filename");`); } catch (e) { }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
    ALTER TABLE "coffee_shops" DROP COLUMN IF EXISTS "main_image_id";
    ALTER TABLE "coffee_shops" DROP COLUMN IF EXISTS "phone";
    ALTER TABLE "coffee_shops" DROP COLUMN IF EXISTS "website";
    ALTER TABLE "coffee_shops" DROP COLUMN IF EXISTS "hours";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "brand_color";
  `)
}
