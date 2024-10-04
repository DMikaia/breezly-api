import { serial, pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from '../index';

export const notifications = pgTable(
  'notifications',
  {
    id: serial('notification_id').primaryKey(),
    sender_id: text('sender_id')
      .references(() => users.clerk_id, { onDelete: 'cascade' })
      .notNull(),
    recipient_id: text('recipient_id')
      .references(() => users.clerk_id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (notifications) => ({
    created_at_index: index('notification_created_at_index').on(
      notifications.created_at,
    ),
    recipient_id_index: index('notification_recipient_id_index').on(
      notifications.recipient_id,
    ),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, {
    fields: [notifications.sender_id],
    references: [users.clerk_id],
  }),
  sender: one(users, {
    fields: [notifications.recipient_id],
    references: [users.clerk_id],
  }),
}));
