import { describe, expect, it } from 'vitest';
import { cancelBooking, createBooking } from '@/features/bookings/service';
import { ConflictError } from '@/lib/errors';
import { makeTestDb } from '../helpers/test-db';

const NOW = new Date('2026-11-03T12:00:00-03:00');
const at = (time: string) => new Date(`2026-11-04T${time}:00-03:00`);

describe('regra de sobreposição (SALA-2)', () => {
  it.each([
    ['mesmo horário', '10:00', '11:00'],
    ['começa dentro da existente', '10:30', '11:30'],
    ['termina dentro da existente', '09:30', '10:30'],
    ['contém a existente', '09:00', '12:00'],
    ['está contida na existente', '10:15', '10:45'],
  ])('rejeita: %s', (_nome, start, end) => {
    const { db, ana, bruno, room } = makeTestDb();
    createBooking(
      db,
      ana,
      { roomId: room.id, start: at('10:00'), end: at('11:00') },
      NOW,
    );

    expect(() =>
      createBooking(
        db,
        bruno,
        { roomId: room.id, start: at(start), end: at(end) },
        NOW,
      ),
    ).toThrow(ConflictError);
  });

  it('permite reservas que apenas se encostam', () => {
    const { db, ana, bruno, room } = makeTestDb();
    createBooking(
      db,
      ana,
      { roomId: room.id, start: at('10:00'), end: at('11:00') },
      NOW,
    );

    expect(() =>
      createBooking(
        db,
        bruno,
        { roomId: room.id, start: at('11:00'), end: at('12:00') },
        NOW,
      ),
    ).not.toThrow();
    expect(() =>
      createBooking(
        db,
        bruno,
        { roomId: room.id, start: at('09:00'), end: at('10:00') },
        NOW,
      ),
    ).not.toThrow();
  });

  it('permite o mesmo horário em outra sala', () => {
    const { db, ana, bruno, room, otherRoom } = makeTestDb();
    createBooking(
      db,
      ana,
      { roomId: room.id, start: at('10:00'), end: at('11:00') },
      NOW,
    );

    expect(() =>
      createBooking(
        db,
        bruno,
        { roomId: otherRoom.id, start: at('10:00'), end: at('11:00') },
        NOW,
      ),
    ).not.toThrow();
  });
});

it('libera o horário depois de cancelar', () => {
  const { db, ana, bruno, room } = makeTestDb();
  const first = createBooking(
    db,
    ana,
    { roomId: room.id, start: at('10:00'), end: at('11:00') },
    NOW,
  );
  cancelBooking(db, ana, first.id, NOW);

  expect(() =>
    createBooking(
      db,
      bruno,
      { roomId: room.id, start: at('10:00'), end: at('11:00') },
      NOW,
    ),
  ).not.toThrow();
});
