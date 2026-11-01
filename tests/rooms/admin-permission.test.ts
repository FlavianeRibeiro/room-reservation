import { describe, expect, it } from 'vitest';
import { createRoom, listRooms, updateRoom } from '@/features/rooms/service';
import { ConflictError, ForbiddenError } from '@/lib/errors';
import { makeTestDb } from '../helpers/test-db';

const input = {
  name: 'Sala Nova',
  capacity: 6,
  location: '',
  resourceIds: [] as number[],
};

describe('permissões de admin (SALA-4)', () => {
  it('usuário comum não cria sala', () => {
    const { db, ana } = makeTestDb();
    expect(() => createRoom(db, ana, input)).toThrow(ForbiddenError);
    expect(listRooms(db, {}, true)).toHaveLength(2);
  });

  it('admin cria sala', () => {
    const { db, admin } = makeTestDb();
    createRoom(db, admin, input);
    expect(listRooms(db, {}, true)).toHaveLength(3);
  });

  it('usuário comum não edita sala', () => {
    const { db, ana, room } = makeTestDb();
    expect(() => updateRoom(db, ana, room.id, input, true)).toThrow(
      ForbiddenError,
    );
  });

  it('admin edita e desativa sala', () => {
    const { db, admin, room } = makeTestDb();
    updateRoom(db, admin, room.id, { ...input, name: 'Sala Renomeada' }, false);
    expect(listRooms(db).map((r) => r.name)).not.toContain('Sala Renomeada');
    expect(listRooms(db, {}, true).map((r) => r.name)).toContain(
      'Sala Renomeada',
    );
  });

  it('não permite nome duplicado', () => {
    const { db, admin } = makeTestDb();
    expect(() =>
      createRoom(db, admin, { ...input, name: 'Sala Teste' }),
    ).toThrow(ConflictError);
  });
});
