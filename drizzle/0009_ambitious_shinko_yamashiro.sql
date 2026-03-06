CREATE TABLE "badges" (
	"id" varchar PRIMARY KEY NOT NULL,
	"shop_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"criteria" varchar NOT NULL,
	"criteria_value" numeric NOT NULL,
	"image_url" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" varchar PRIMARY KEY NOT NULL,
	"shop_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"visits_required" numeric NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unlocked_rewards" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reward_id" varchar NOT NULL,
	"unlocked_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"redeemed_at" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" varchar NOT NULL,
	"earned_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "total_visits_count" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "current_tier" text DEFAULT 'Explorador/a';--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "staff_id" text;--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "method" varchar DEFAULT 'qr_scan' NOT NULL;--> statement-breakpoint
ALTER TABLE "visits" ADD COLUMN "fraud_metadata" text;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_shop_id_coffee_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unlocked_rewards" ADD CONSTRAINT "unlocked_rewards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unlocked_rewards" ADD CONSTRAINT "unlocked_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "badges_shop_idx" ON "badges" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX "rewards_shop_idx" ON "rewards" USING btree ("shop_id");--> statement-breakpoint
CREATE INDEX "unlocked_rewards_user_idx" ON "unlocked_rewards" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "unlocked_rewards_reward_idx" ON "unlocked_rewards" USING btree ("reward_id");--> statement-breakpoint
CREATE INDEX "user_badges_user_idx" ON "user_badges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_badges_badge_idx" ON "user_badges" USING btree ("badge_id");--> statement-breakpoint
ALTER TABLE "visits" ADD CONSTRAINT "visits_staff_id_user_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "visits_staff_idx" ON "visits" USING btree ("staff_id");