import { and, eq, gt, lt } from 'drizzle-orm';
import type { Db } from '@/db/client';
import { bookings, rooms, type User } from '@/db/schema';
import { ConflictError, NotFoundError } from '@/lib/errors';
import { formatDateTime } from '@/lib/time';
import { validateBooking } from './domain/validate-booking';

export type CreateBookingInput = { roomId: number; start: Date; end: Date };

export function createBooking(
  db: Db,
  user: Pick<User, 'id'>,
  input: CreateBookingInput,
  now: Date = new Date(),
) {
  const room = db.select().from(rooms).where(eq(rooms.id, input.roomId)).get();
  if (!room || !room.active) throw new NotFoundError('Sala não encontrada.');

  validateBooking({ start: input.start, end: input.end }, now);

  return db.transaction(
    (tx) => {
      const conflict = tx
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.roomId, room.id),
            eq(bookings.status, 'active'),
            lt(bookings.startAt, input.end),
            gt(bookings.endAt, input.start),
          ),
        )
        .get();
      if (conflict) {
        throw new ConflictError(
          `Sala ocupada das ${formatDateTime(conflict.startAt)} às ${formatDateTime(conflict.endAt)}.`,
        );
      }
      return tx
        .insert(bookings)
        .values({
          roomId: room.id,
          userId: user.id,
          startAt: input.start,
          endAt: input.end,
          status: 'active',
          createdAt: now,
        })
        .returning()
        .get();
    },
    { behavior: 'immediate' },
  );
}
