import Link from 'next/link';
import { getDb } from '@/db/client';
import { requireAdminPage } from '@/features/auth/session';
import { listRooms } from '@/features/rooms/service';

export default async function AdminRoomsPage() {
  await requireAdminPage();
  const rooms = listRooms(getDb(), {}, true);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administrar salas</h1>
        <Link
          href="/admin/rooms/new"
          className="rounded bg-slate-900 px-4 py-2 text-white"
        >
          Nova sala
        </Link>
      </div>
      <table className="w-full rounded bg-white text-left text-sm shadow">
        <thead>
          <tr>
            <th className="p-3">Nome</th>
            <th>Capacidade</th>
            <th>Recursos</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-t">
              <td className="p-3">{room.name}</td>
              <td>{room.capacity}</td>
              <td>{room.resources.join(', ') || '-'}</td>
              <td>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
                    room.active ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {room.active ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td>
                <Link
                  href={`/admin/rooms/${room.id}/edit`}
                  className="underline"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
