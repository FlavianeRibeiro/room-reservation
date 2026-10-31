import { describe, expect, it } from 'vitest';
import { resources, roomResources } from '@/db/schema';
import { roomFiltersSchema } from '@/features/rooms/schemas';
import { listRooms } from '@/features/rooms/service';
import { makeTestDb } from '../../../tests/helpers/test-db';

describe('listagem de salas (SALA-1)', () => {
  it('filtra por capacidade mínima e por recurso', () => {
    const { db, room } = makeTestDb();
    const projetor = db
      .insert(resources)
      .values({ name: 'Projetor' })
      .returning()
      .get();
    db.insert(roomResources)
      .values({ roomId: room.id, resourceId: projetor.id })
      .run();

    expect(listRooms(db)).toHaveLength(2);
    expect(listRooms(db, { minCapacity: 8 }).map((r) => r.name)).toEqual([
      'Sala Teste',
    ]);
    expect(listRooms(db, { resource: 'Projetor' }).map((r) => r.name)).toEqual([
      'Sala Teste',
    ]);
    expect(listRooms(db, { minCapacity: 20 })).toEqual([]);
  });

  it('ignora parâmetros inválidos da URL', () => {
    const parsed = roomFiltersSchema.parse({
      minCapacity: 'abc',
      resource: '',
    });
    expect(parsed.minCapacity).toBeUndefined();
    expect(parsed.resource).toBeUndefined();
  });
});
