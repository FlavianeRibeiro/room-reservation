import { asc, eq } from 'drizzle-orm';
import type { Db } from '@/db/client';
import { resources, roomResources, rooms } from '@/db/schema';

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
