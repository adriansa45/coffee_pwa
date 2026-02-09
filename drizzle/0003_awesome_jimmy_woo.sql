CREATE TABLE IF NOT EXISTS "shop_follows" (
	"user_id" text NOT NULL,
	"shop_id" varchar NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "fcm_token" text;--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops" ADD COLUMN IF NOT EXISTS "main_image_id" integer NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shop_follows_user_idx" ON "shop_follows" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shop_follows_shop_idx" ON "shop_follows" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coffee_shops_main_image_idx" ON "payload"."coffee_shops" USING btree ("main_image_id");

ALTER TABLE "shop_follows" DROP CONSTRAINT IF EXISTS "shop_follows_shop_id_coffee_shops_id_fk";
ALTER TABLE "payload"."coffee_shops" DROP CONSTRAINT IF EXISTS "coffee_shops_main_image_id_media_id_fk";
ALTER TABLE "shop_follows" DROP CONSTRAINT IF EXISTS "shop_follows_user_id_user_id_fk";

ALTER TABLE "shop_follows" ADD CONSTRAINT  "shop_follows_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops" ADD CONSTRAINT "coffee_shops_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_follows" ADD CONSTRAINT  "shop_follows_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint