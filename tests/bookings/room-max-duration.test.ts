import { describe, expect, it } from 'vitest';
import { rooms } from '@/db/schema';
import { createBooking } from '@/features/bookings/service';
import { ValidationError } from '@/lib/errors';
import { makeTestDb } from '../helpers/test-db';

const NOW = new Date('2026-11-03T12:00:00-03:00');
const at = (time: string) => new Date(`2026-11-04T${time}:00-03:00`);

describe('duração máxima por sala (SALA-6)', () => {
  it('cada sala aplica o seu próprio limite', () => {
    const { db, ana, room } = makeTestDb();
    const curta = db
      .insert(rooms)
      .values({ name: 'Sala Curta', capacity: 2, maxDurationMinutes: 60 })
      .returning()
      .get();

    expect(() =>
      createBooking(
        db,
        ana,
        { roomId: curta.id, start: at('10:00'), end: at('11:01') },
        NOW,
      ),
    ).toThrow(ValidationError);
    expect(() =>
      createBooking(
        db,
        ana,
        { roomId: curta.id, start: at('10:00'), end: at('11:00') },
        NOW,
      ),
    ).not.toThrow();
    // a sala padrão continua aceitando até 4 horas
    expect(() =>
      createBooking(
        db,
        ana,
        { roomId: room.id, start: at('10:00'), end: at('14:00') },
        NOW,
      ),
    ).not.toThrow();
  });
});
