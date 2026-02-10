CREATE TABLE "payload"."features" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"icon" varchar,
	"color" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops_rels" ADD COLUMN "features_id" integer;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "features_id" integer;--> statement-breakpoint
CREATE UNIQUE INDEX "features_name_idx" ON "payload"."features" USING btree ("name");--> statement-breakpoint
CREATE INDEX "features_updated_at_idx" ON "payload"."features" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "features_created_at_idx" ON "payload"."features" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "payload"."coffee_shops_rels" ADD CONSTRAINT "coffee_shops_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "payload"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_features_fk" FOREIGN KEY ("features_id") REFERENCES "payload"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "coffee_shops_rels_features_id_idx" ON "payload"."coffee_shops_rels" USING btree ("features_id");--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_features_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("features_id");