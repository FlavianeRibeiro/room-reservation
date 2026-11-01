import { getDb } from '@/db/client';
import { getCurrentUser } from '@/features/auth/session';
import { cancelBookingAction } from '@/features/bookings/actions';
import { listMyBookings } from '@/features/bookings/service';
import { formatDateTime, formatTime } from '@/lib/time';

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getCurrentUser();
  // Caso não esteja logado com nenhum usuário
  if (!user)
    return <p>Escolha um usuário em «Entrar como» para ver suas reservas.</p>;
  // Listar reservas dousuário logado
  const items = listMyBookings(getDb(), user);
  const now = new Date();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Minhas reservas</h1>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded bg-red-100 p-2 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {items.length === 0 ? (
        <p>Você ainda não tem reservas.</p>
      ) : (
        <table className="border-collapse border border-gray-400 w-full rounded bg-white text-left text-sm shadow">
          <thead>
            <tr>
              <th className="p-3">Sala</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.roomName}</td>
                <td>{formatDateTime(b.startAt)}</td>
                <td>
                  {formatTime(b.startAt)} até {formatTime(b.endAt)}
                </td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
                      b.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {b.status === 'active' ? 'Ativa' : 'Cancelada'}
                  </span>
                </td>
                <td>
                  {b.status === 'active' && b.endAt > now && (
                    <form action={cancelBookingAction}>
                      <input type="hidden" name="bookingId" value={b.id} />
                      <button className="text-red-700 underline">
                        Cancelar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
