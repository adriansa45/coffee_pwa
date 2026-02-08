ALTER TABLE "payload"."coffee_shops" ADD COLUMN "phone" varchar;--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops" ADD COLUMN "website" varchar;--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops" ADD COLUMN "hours" jsonb;--> statement-breakpoint
ALTER TABLE "payload"."users" ADD COLUMN "brand_color" varchar DEFAULT '#820E2B';