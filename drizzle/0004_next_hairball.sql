CREATE INDEX IF NOT EXISTS "blog_author_id_index" ON "blogs" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_created_at_index" ON "blogs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_blog_id_index" ON "comments" USING btree ("blog_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "comment_user_id_index" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notification_created_at_index" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notification_recipient_id_index" ON "notifications" USING btree ("recipient_id");