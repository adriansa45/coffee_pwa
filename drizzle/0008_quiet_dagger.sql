CREATE TABLE "payload"."leeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"coffee_shop_name" varchar NOT NULL,
	"instagram_user" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "leeds_id" integer;--> statement-breakpoint
CREATE INDEX "leeds_updated_at_idx" ON "payload"."leeds" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "leeds_created_at_idx" ON "payload"."leeds" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leeds_fk" FOREIGN KEY ("leeds_id") REFERENCES "payload"."leeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_leeds_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("leeds_id");