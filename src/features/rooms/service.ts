import { asc, eq } from 'drizzle-orm';
import type { Db } from '@/db/client';
import { resources, roomResources, rooms } from '@/db/schema';
import { type User } from '@/db/schema';
import { assertAdmin } from '@/features/auth/permissions';
import { ConflictError, NotFoundError } from '@/lib/errors';
import type { RoomInput } from './schemas';

export type RoomFilters = { minCapacity?: number; resource?: string }; // dados do filtro passado por url

// busca as salas ativas, busca os recursos de cada sala e junta tudo
export function listRooms(
  db: Db, // conexão com banco
  filters: RoomFilters = {},
  includeInactive = false,
) {
  const base = includeInactive
    ? db.select().from(rooms).all()
    : db.select().from(rooms).where(eq(rooms.active, true)).all();

  const links = db
    .select({ roomId: roomResources.roomId, name: resources.name })
    .from(roomResources)
    .innerJoin(resources, eq(resources.id, roomResources.resourceId))
    .all();

  return base
    .map((room) => ({
      ...room,
      resources: links.filter((l) => l.roomId === room.id).map((l) => l.name),
    }))
    .filter(
      (r) =>
        filters.minCapacity === undefined || r.capacity >= filters.minCapacity,
    )
    .filter((r) => !filters.resource || r.resources.includes(filters.resource))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function listResources(db: Db) {
  return db.select().from(resources).orderBy(asc(resources.name)).all();
}
// devolve a sala com a lista de ids dos recursos
export function getRoom(db: Db, id: number) {
  const room = db.select().from(rooms).where(eq(rooms.id, id)).get();
  if (!room) return null;
  const resourceIds = db
    .select({ id: roomResources.resourceId })
    .from(roomResources)
    .where(eq(roomResources.roomId, id))
    .all()
    .map((r) => r.id);
  return { ...room, resourceIds };
}
//Se der erro no meio do processo, o banco desfaz tudo para não deixar dados quebrados.
type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

function setResources(tx: Tx, roomId: number, resourceIds: number[]) {
  tx.delete(roomResources).where(eq(roomResources.roomId, roomId)).run();
  if (resourceIds.length > 0) {
    tx.insert(roomResources)
      .values(resourceIds.map((resourceId) => ({ roomId, resourceId })))
      .run();
  }
}

export function createRoom(db: Db, user: Pick<User, 'role'>, input: RoomInput) {
  assertAdmin(user);
  return db.transaction((tx) => {
    const exists = tx
      .select()
      .from(rooms)
      .where(eq(rooms.name, input.name))
      .get();
    if (exists) throw new ConflictError('Já existe uma sala com esse nome.');
    const room = tx
      .insert(rooms)
      .values({
        name: input.name,
        capacity: input.capacity,
        location: input.location || null,
      })
      .returning()
      .get();
    setResources(tx, room.id, input.resourceIds);
    return room;
  });
}

export function updateRoom(
  db: Db,
  user: Pick<User, 'role'>,
  id: number,
  input: RoomInput,
  active: boolean,
) {
  assertAdmin(user);
  return db.transaction((tx) => {
    const current = tx.select().from(rooms).where(eq(rooms.id, id)).get();
    if (!current) throw new NotFoundError('Sala não encontrada.');
    const duplicate = tx
      .select()
      .from(rooms)
      .where(eq(rooms.name, input.name))
      .get();
    if (duplicate && duplicate.id !== id) {
      throw new ConflictError('Já existe uma sala com esse nome.');
    }
    const room = tx
      .update(rooms)
      .set({
        name: input.name,
        capacity: input.capacity,
        location: input.location || null,
        active,
      })
      .where(eq(rooms.id, id))
      .returning()
      .get();
    setResources(tx, id, input.resourceIds);
    return room;
  });
}
