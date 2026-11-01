'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/db/client';
import { requireUser } from '@/features/auth/session';
import { toActionError, type ActionState } from '@/lib/action-result';
import { parseRoomForm } from './schemas';
import { createRoom, updateRoom } from './service';

export async function createRoomAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    createRoom(getDb(), user, parseRoomForm(formData));
  } catch (err) {
    return toActionError(err);
  }
  revalidatePath('/rooms');
  redirect('/admin/rooms');
}

export async function updateRoomAction(
  roomId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    updateRoom(
      getDb(),
      user,
      roomId,
      parseRoomForm(formData),
      formData.get('active') === 'on',
    );
  } catch (err) {
    return toActionError(err);
  }
  revalidatePath('/rooms');
  redirect('/admin/rooms');
}
