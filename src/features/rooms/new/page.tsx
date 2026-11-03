import { getDb } from '@/db/client';
import { requireAdminPage } from '@/features/auth/session';
import { createRoomAction } from '@/features/rooms/actions';
import { listResources } from '@/features/rooms/service';
import RoomForm from '../room-form';

export default async function NewRoomPage() {
  await requireAdminPage();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Nova sala</h1>
      <RoomForm action={createRoomAction} resources={listResources(getDb())} />
    </div>
  );
}
