'use server';

import { revalidatePath } from 'next/cache';
import { cancelBooking, createBooking } from './service';
import { redirect } from 'next/navigation';
import { getDb } from '@/db/client';
import { requireUser } from '@/features/auth/session';
import { toActionError, type ActionState } from '@/lib/action-result';
import { parseLocalDateTime } from '@/lib/time';

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? '');

export async function createBookingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const user = await requireUser();
    createBooking(getDb(), user, {
      roomId: Number(formData.get('roomId')),
      start: parseLocalDateTime(
        text(formData, 'date'),
        text(formData, 'start'),
      ),
      end: parseLocalDateTime(text(formData, 'date'), text(formData, 'end')),
    });
  } catch (err) {
    return toActionError(err);
  }
  redirect('/my-bookings');
}

export async function cancelBookingAction(formData: FormData) {
  let message: string | null = null;
  try {
    const user = await requireUser();
    cancelBooking(getDb(), user, Number(formData.get('bookingId')));
  } catch (err) {
    message = toActionError(err).error;
  }
  revalidatePath('/my-bookings');
  redirect(
    message
      ? `/my-bookings?error=${encodeURIComponent(message)}`
      : '/my-bookings',
  );
}
