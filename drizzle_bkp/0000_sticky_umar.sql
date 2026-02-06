CREATE SCHEMA "payload";
--> statement-breakpoint
CREATE TABLE "payload"."coffee_shops" (
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
--> statement-breakpoint
CREATE TABLE "payload"."payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload"."payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload"."payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"coffee_shops_id" varchar,
	"visits_id" varchar,
	"reviews_id" varchar,
	"tags_id" varchar
);
--> statement-breakpoint
CREATE TABLE "payload"."payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload"."payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload"."payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);
--> statement-breakpoint
CREATE TABLE "payload"."reviews" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "payload"."reviews_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" varchar NOT NULL,
	"path" varchar NOT NULL,
	"tags_id" varchar
);
--> statement-breakpoint
CREATE TABLE "payload"."tags" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
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
--> statement-breakpoint
CREATE TABLE "payload"."users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payload"."visits" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"shop_id" varchar NOT NULL,
	"visited_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coffee_shops_fk" FOREIGN KEY ("coffee_shops_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visits_fk" FOREIGN KEY ("visits_id") REFERENCES "payload"."visits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "payload"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."reviews" ADD CONSTRAINT "reviews_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."reviews_rels" ADD CONSTRAINT "reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."reviews_rels" ADD CONSTRAINT "reviews_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."visits" ADD CONSTRAINT "visits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."visits" ADD CONSTRAINT "visits_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "coffee_shops_updated_at_idx" ON "payload"."coffee_shops" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "coffee_shops_created_at_idx" ON "payload"."coffee_shops" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_coffee_shops_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("coffee_shops_id");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_visits_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("visits_id");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("reviews_id");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("tags_id");--> statement-breakpoint
CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");--> statement-breakpoint
CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");--> statement-breakpoint
CREATE INDEX "reviews_user_idx" ON "payload"."reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reviews_shop_idx" ON "payload"."reviews" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX "reviews_updated_at_idx" ON "payload"."reviews" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "reviews_created_at_idx" ON "payload"."reviews" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reviews_rels_order_idx" ON "payload"."reviews_rels" USING btree ("order");--> statement-breakpoint
CREATE INDEX "reviews_rels_parent_idx" ON "payload"."reviews_rels" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "reviews_rels_path_idx" ON "payload"."reviews_rels" USING btree ("path");--> statement-breakpoint
CREATE INDEX "reviews_rels_tags_id_idx" ON "payload"."reviews_rels" USING btree ("tags_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_idx" ON "payload"."tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tags_updated_at_idx" ON "payload"."tags" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "tags_created_at_idx" ON "payload"."tags" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");--> statement-breakpoint
CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");--> statement-breakpoint
CREATE INDEX "visits_user_idx" ON "payload"."visits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "visits_shop_idx" ON "payload"."visits" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX "visits_updated_at_idx" ON "payload"."visits" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "visits_created_at_idx" ON "payload"."visits" USING btree ("created_at");