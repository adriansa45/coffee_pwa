CREATE TABLE "review_tags" (
	"review_id" varchar NOT NULL,
	"tag_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shop_id" varchar NOT NULL,
	"rating" varchar NOT NULL,
	"coffee_rating" numeric(2, 1) DEFAULT '0',
	"food_rating" numeric(2, 1) DEFAULT '0',
	"place_rating" numeric(2, 1) DEFAULT '0',
	"price_rating" numeric(2, 1) DEFAULT '0',
	"comment" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shop_id" varchar NOT NULL,
	"visited_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payload"."reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payload"."reviews_rels" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payload"."visits" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "payload"."reviews" CASCADE;--> statement-breakpoint
DROP TABLE "payload"."reviews_rels" CASCADE;--> statement-breakpoint
DROP TABLE "payload"."visits" CASCADE;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_visits_fk";
--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_reviews_fk";
--> statement-breakpoint
DROP INDEX "payload"."payload_locked_documents_rels_visits_id_idx";--> statement-breakpoint
DROP INDEX "payload"."payload_locked_documents_rels_reviews_id_idx";--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payload"."payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payload"."users" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payload"."users_sessions" ALTER COLUMN "_parent_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payload"."users" ADD COLUMN "image" varchar;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tags" ADD CONSTRAINT "review_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "payload"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "review_tags_review_idx" ON "review_tags" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "review_tags_tag_idx" ON "review_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "reviews_user_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reviews_shop_idx" ON "reviews" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX "visits_user_idx" ON "visits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "visits_shop_idx" ON "visits" USING btree ("shop_id");--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "visits_id";--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "reviews_id";