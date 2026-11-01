import { notFound } from 'next/navigation';
import { getDb } from '@/db/client';
import { getCurrentUser } from '@/features/auth/session';
import { getRoom } from '@/features/rooms/service';
import BookingForm from './booking-form';

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = getRoom(getDb(), Number(id));
  if (!room || !room.active) notFound();
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Reservar: {room.name}</h1>
      <p className="mb-4 text-sm text-slate-600">
        Capacidade: {room.capacity} pessoas. Duração: de 15 minutos a 4 horas.
      </p>
      {user ? (
        <BookingForm roomId={room.id} />
      ) : (
        <p>Escolha um usuário em «Entrar como» para reservar.</p>
      )}
    </div>
  );
}
