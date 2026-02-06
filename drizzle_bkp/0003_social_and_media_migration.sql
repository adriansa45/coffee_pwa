CREATE TABLE "payload"."coffee_shops_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" varchar NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer
);
--> statement-breakpoint
CREATE TABLE "payload"."media" (
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
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" text NOT NULL,
	"following_id" text NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops" ALTER COLUMN "description" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "media_id" integer;--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops_rels" ADD CONSTRAINT "coffee_shops_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."coffee_shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops_rels" ADD CONSTRAINT "coffee_shops_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "coffee_shops_rels_order_idx" ON "payload"."coffee_shops_rels" USING btree ("order");--> statement-breakpoint
CREATE INDEX "coffee_shops_rels_parent_idx" ON "payload"."coffee_shops_rels" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "coffee_shops_rels_path_idx" ON "payload"."coffee_shops_rels" USING btree ("path");--> statement-breakpoint
CREATE INDEX "coffee_shops_rels_media_id_idx" ON "payload"."coffee_shops_rels" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");--> statement-breakpoint
CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");--> statement-breakpoint
CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");--> statement-breakpoint
CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "payload"."media" USING btree ("sizes_tablet_filename");--> statement-breakpoint
CREATE INDEX "follower_idx" ON "follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "following_idx" ON "follows" USING btree ("following_id");--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");