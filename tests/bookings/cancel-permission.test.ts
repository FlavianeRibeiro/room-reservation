import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { bookings } from '@/db/schema';
import { cancelBooking, createBooking } from '@/features/bookings/service';
import { ForbiddenError, NotFoundError } from '@/lib/errors';
import { makeTestDb } from '../helpers/test-db';

const NOW = new Date('2026-11-03T12:00:00-03:00');
const at = (time: string) => new Date(`2026-11-04T${time}:00-03:00`);

function setup() {
  const ctx = makeTestDb();
  const booking = createBooking(
    ctx.db,
    ctx.ana,
    { roomId: ctx.room.id, start: at('10:00'), end: at('11:00') },
    NOW,
  );
  const statusOf = () =>
    ctx.db.select().from(bookings).where(eq(bookings.id, booking.id)).get()
      ?.status;
  return { ...ctx, booking, statusOf };
}

describe('permissão de cancelamento (SALA-3)', () => {
  it('o dono cancela a própria reserva', () => {
    const { db, ana, booking, statusOf } = setup();
    cancelBooking(db, ana, booking.id, NOW);
    expect(statusOf()).toBe('canceled');
  });

  it('outro usuário comum NÃO cancela e a reserva continua ativa', () => {
    const { db, bruno, booking, statusOf } = setup();
    expect(() => cancelBooking(db, bruno, booking.id, NOW)).toThrow(
      ForbiddenError,
    );
    expect(statusOf()).toBe('active');
  });

  it('nem o admin cancela reserva de terceiros', () => {
    const { db, admin, booking, statusOf } = setup();
    expect(() => cancelBooking(db, admin, booking.id, NOW)).toThrow(
      ForbiddenError,
    );
    expect(statusOf()).toBe('active');
  });

  it('reserva inexistente dá NotFoundError', () => {
    const { db, ana } = setup();
    expect(() => cancelBooking(db, ana, 9999, NOW)).toThrow(NotFoundError);
  });
});
