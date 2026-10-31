import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
});

export const rooms = sqliteTable('rooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  capacity: integer('capacity').notNull(),
  location: text('location'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
});

export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

export const roomResources = sqliteTable(
  'room_resources',
  {
    roomId: integer('room_id')
      .notNull()
      .references(() => rooms.id),
    resourceId: integer('resource_id')
      .notNull()
      .references(() => resources.id),
  },
  (t) => [primaryKey({ columns: [t.roomId, t.resourceId] })],
);

export const bookings = sqliteTable(
  'bookings',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    roomId: integer('room_id')
      .notNull()
      .references(() => rooms.id),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    startAt: integer('start_at', { mode: 'timestamp_ms' }).notNull(),
    endAt: integer('end_at', { mode: 'timestamp_ms' }).notNull(),
    status: text('status', { enum: ['active', 'canceled'] })
      .notNull()
      .default('active'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    canceledAt: integer('canceled_at', { mode: 'timestamp_ms' }),
  },
  (t) => [index('bookings_room_idx').on(t.roomId, t.status, t.startAt)],
);

export type User = typeof users.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
