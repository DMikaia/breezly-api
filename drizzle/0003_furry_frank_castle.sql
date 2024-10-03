DROP INDEX IF EXISTS "user_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_index" ON "users" USING btree ("clerk_id","email","username");