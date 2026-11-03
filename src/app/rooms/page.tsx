import Link from 'next/link';
import { getDb } from '@/db/client';
import { roomFiltersSchema } from '@/features/rooms/schemas';
import { listResources, listRooms } from '@/features/rooms/service';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams; // No Next 15, searchParams é uma Promise!

  // Trata e valida os filtros da URL
  const filters = roomFiltersSchema.parse({
    minCapacity: first(params.minCapacity),
    resource: first(params.resource),
  });

  const db = getDb();
  const rooms = listRooms(db, filters);
  const allResources = listResources(db);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Salas</h1>

      {/* Formulário GET envia os filtros para a própria URL */}
      <form
        method="get"
        className="mb-6 flex flex-wrap items-end gap-4 rounded bg-white p-4 shadow"
      >
        <label className="flex flex-col text-sm">
          Capacidade mínima
          <input
            type="number"
            name="minCapacity"
            min={1}
            defaultValue={filters.minCapacity}
            className="rounded border p-2"
          />
        </label>
        <label className="flex flex-col text-sm">
          Recurso
          <select
            name="resource"
            defaultValue={filters.resource ?? ''}
            className="rounded border p-2"
          >
            <option value="">Qualquer</option>
            {allResources.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded bg-slate-900 px-4 py-2 text-white">
          Filtrar
        </button>
        <Link href="/rooms" className="py-2 text-sm underline">
          Limpar
        </Link>
      </form>

      {/* Lista de Salas ou mensagem de "não encontrado" */}
      {rooms.length === 0 ? (
        <p>Nenhuma sala encontrada com esses filtros.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {rooms.map((room) => (
            <li key={room.id} className="rounded bg-white p-4 shadow">
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <p className="text-sm text-slate-600">
                {room.capacity} pessoas · {room.location}
              </p>
              <p className="my-2 text-sm">
                {room.resources.join(', ') || 'Sem recursos'}
              </p>

              <div className="mt-auto pt-2">
                <Link
                  href={`/rooms/${room.id}/book`}
                  className="text-sm font-medium underline"
                >
                  Reservar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
