import { notFound } from 'next/navigation';
import { getDb } from '@/db/client';
import { requireAdminPage } from '@/features/auth/session';
import { updateRoomAction } from '@/features/rooms/actions';
import { getRoom, listResources } from '@/features/rooms/service';
import RoomForm from '../../room-form';
import { ActionState } from '@/lib/action-result';

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const db = getDb();
  const room = getRoom(db, Number(id));
  if (!room) notFound();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Editar sala</h1>
      <RoomForm
        action={
          updateRoomAction.bind(null, room.id) as unknown as (
            prev: ActionState,
            formData: FormData,
          ) => Promise<ActionState>
        }
        resources={listResources(db)}
        room={room}
      />
    </div>
  );
}
