import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"image" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "coffee_shops" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"address" varchar,
  	"google_maps_url" varchar,
  	"rating" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "visits" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"shop_id" varchar NOT NULL,
  	"visited_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "reviews" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"shop_id" varchar NOT NULL,
  	"rating" varchar NOT NULL,
  	"coffee_rating" numeric DEFAULT 0,
  	"food_rating" numeric DEFAULT 0,
  	"place_rating" numeric DEFAULT 0,
  	"price_rating" numeric DEFAULT 0,
  	"comment" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "reviews_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "tags" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar,
  	"coffee_shops_id" varchar,
  	"visits_id" varchar,
  	"reviews_id" varchar,
  	"tags_id" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  `);

  // Use separate try/catch blocks for robustness as some parts might already exist
  try {
    await db.execute(sql`ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY("_parent_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;`);
  } catch (e) { }

  try {
    await db.execute(sql`ALTER TABLE "visits" ADD CONSTRAINT "visits_user_id_users_id_fk" FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;`);
  } catch (e) { }

  try {
    await db.execute(sql`ALTER TABLE "visits" ADD CONSTRAINT "visits_shop_id_coffee_shops_id_fk" FOREIGN KEY("shop_id") REFERENCES "coffee_shops"("id") ON DELETE set null ON UPDATE no action;`);
  } catch (e) { }

  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions"("_order");
  CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions"("_parent_id");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users"("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
  CREATE INDEX IF NOT EXISTS "coffee_shops_updated_at_idx" ON "coffee_shops"("updated_at");
  CREATE INDEX IF NOT EXISTS "coffee_shops_created_at_idx" ON "coffee_shops"("created_at");
  CREATE INDEX IF NOT EXISTS "visits_user_idx" ON "visits"("user_id");
  CREATE INDEX IF NOT EXISTS "visits_shop_idx" ON "visits"("shop_id");
  CREATE INDEX IF NOT EXISTS "visits_updated_at_idx" ON "visits"("updated_at");
  CREATE INDEX IF NOT EXISTS "visits_created_at_idx" ON "visits"("created_at");
  CREATE INDEX IF NOT EXISTS "reviews_user_idx" ON "reviews"("user_id");
  CREATE INDEX IF NOT EXISTS "reviews_shop_idx" ON "reviews"("shop_id");
  CREATE INDEX IF NOT EXISTS "reviews_updated_at_idx" ON "reviews"("updated_at");
  CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews"("created_at");
  CREATE INDEX IF NOT EXISTS "reviews_rels_order_idx" ON "reviews_rels"("order");
  CREATE INDEX IF NOT EXISTS "reviews_rels_parent_idx" ON "reviews_rels"("parent_id");
  CREATE INDEX IF NOT EXISTS "reviews_rels_path_idx" ON "reviews_rels"("path");
  CREATE INDEX IF NOT EXISTS "reviews_rels_tags_id_idx" ON "reviews_rels"("tags_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "tags_name_idx" ON "tags"("name");
  CREATE INDEX IF NOT EXISTS "tags_updated_at_idx" ON "tags"("updated_at");
  CREATE INDEX IF NOT EXISTS "tags_created_at_idx" ON "tags"("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv"("key");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents"("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents"("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents"("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels"("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels"("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels"("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels"("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_coffee_shops_id_idx" ON "payload_locked_documents_rels"("coffee_shops_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_visits_id_idx" ON "payload_locked_documents_rels"("visits_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels"("reviews_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels"("tags_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences"("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences"("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences"("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels"("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels"("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels"("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels"("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations"("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations"("created_at"); `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "users_sessions" CASCADE;
  DROP TABLE IF EXISTS "users" CASCADE;
  DROP TABLE IF EXISTS "coffee_shops" CASCADE;
  DROP TABLE IF EXISTS "visits" CASCADE;
  DROP TABLE IF EXISTS "reviews" CASCADE;
  DROP TABLE IF EXISTS "reviews_rels" CASCADE;
  DROP TABLE IF EXISTS "tags" CASCADE;
  DROP TABLE IF EXISTS "payload_kv" CASCADE;
  DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
  DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_preferences" CASCADE;
  DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
  DROP TABLE IF EXISTS "payload_migrations" CASCADE; `)
}
