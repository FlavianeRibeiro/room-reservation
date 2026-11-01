import { and, desc, eq, gt, lt } from 'drizzle-orm';
import type { Db } from '@/db/client';
import { bookings, rooms, type User } from '@/db/schema';
import { ConflictError, NotFoundError } from '@/lib/errors';
import { formatDateTime } from '@/lib/time';
import { validateBooking } from './domain/validate-booking';
import { assertCanCancel } from '@/features/auth/permissions';

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

export function cancelBooking(
  db: Db,
  user: Pick<User, 'id'>,
  bookingId: number,
  now: Date = new Date(),
) {
  const booking = db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .get();
  if (!booking) throw new NotFoundError('Reserva não encontrada.');

  assertCanCancel(user, booking);

  if (booking.status === 'canceled') {
    throw new ConflictError('Esta reserva já foi cancelada.');
  }
  if (booking.endAt.getTime() <= now.getTime()) {
    throw new ConflictError(
      'Esta reserva já terminou e não pode ser cancelada.',
    );
  }

  return db
    .update(bookings)
    .set({ status: 'canceled', canceledAt: now })
    .where(eq(bookings.id, bookingId))
    .returning()
    .get();
}

export function listMyBookings(db: Db, user: Pick<User, 'id'>) {
  return db
    .select({
      id: bookings.id,
      roomName: rooms.name,
      startAt: bookings.startAt,
      endAt: bookings.endAt,
      status: bookings.status,
    })
    .from(bookings)
    .innerJoin(rooms, eq(rooms.id, bookings.roomId))
    .where(eq(bookings.userId, user.id))
    .orderBy(desc(bookings.startAt))
    .all();
}
