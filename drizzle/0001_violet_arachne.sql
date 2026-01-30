CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"shop_id" uuid NOT NULL,
	"rating" text NOT NULL,
	"coffee_rating" double precision DEFAULT 0,
	"food_rating" double precision DEFAULT 0,
	"place_rating" double precision DEFAULT 0,
	"price_rating" double precision DEFAULT 0,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews_tags" (
	"review_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "reviews_tags_review_id_tag_id_pk" PRIMARY KEY("review_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "coffee_shops" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "coffee_shops" ADD COLUMN "rating" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'customer' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "user_code" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "shop_id" uuid;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."coffee_shops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews_tags" ADD CONSTRAINT "reviews_tags_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews_tags" ADD CONSTRAINT "reviews_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."coffee_shops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_user_code_unique" UNIQUE("user_code");