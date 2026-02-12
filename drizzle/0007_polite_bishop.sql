CREATE TABLE "review_likes" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"review_id" varchar NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "review_likes" ADD CONSTRAINT "review_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_likes" ADD CONSTRAINT "review_likes_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "review_likes_user_idx" ON "review_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "review_likes_review_idx" ON "review_likes" USING btree ("review_id");