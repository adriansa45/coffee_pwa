ALTER TABLE "payload"."users" RENAME TO "admin_users";--> statement-breakpoint
ALTER TABLE "payload"."users_sessions" RENAME TO "admin_users_sessions";--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" RENAME COLUMN "users_id" TO "admin_users_id";--> statement-breakpoint
ALTER TABLE "payload"."payload_preferences_rels" RENAME COLUMN "users_id" TO "admin_users_id";--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_users_fk";
--> statement-breakpoint
ALTER TABLE "payload"."payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_users_fk";
--> statement-breakpoint
ALTER TABLE "payload"."admin_users_sessions" DROP CONSTRAINT "users_sessions_parent_id_fk";
--> statement-breakpoint
DROP INDEX "payload"."payload_locked_documents_rels_users_id_idx";--> statement-breakpoint
DROP INDEX "payload"."payload_preferences_rels_users_id_idx";--> statement-breakpoint
DROP INDEX "payload"."users_updated_at_idx";--> statement-breakpoint
DROP INDEX "payload"."users_created_at_idx";--> statement-breakpoint
DROP INDEX "payload"."users_email_idx";--> statement-breakpoint
DROP INDEX "payload"."users_sessions_order_idx";--> statement-breakpoint
DROP INDEX "payload"."users_sessions_parent_id_idx";--> statement-breakpoint
ALTER TABLE "payload"."admin_users" ADD COLUMN "fcm_token" varchar;--> statement-breakpoint
ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "payload"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("admin_users_id") REFERENCES "payload"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payload"."admin_users_sessions" ADD CONSTRAINT "admin_users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payload_locked_documents_rels_admin_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("admin_users_id");--> statement-breakpoint
CREATE INDEX "payload_preferences_rels_admin_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("admin_users_id");--> statement-breakpoint
CREATE INDEX "admin_users_updated_at_idx" ON "payload"."admin_users" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "admin_users_created_at_idx" ON "payload"."admin_users" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_idx" ON "payload"."admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_users_sessions_order_idx" ON "payload"."admin_users_sessions" USING btree ("_order");--> statement-breakpoint
CREATE INDEX "admin_users_sessions_parent_id_idx" ON "payload"."admin_users_sessions" USING btree ("_parent_id");