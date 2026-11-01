'use server';

import { redirect } from 'next/navigation';
import { getDb } from '@/db/client';
import { requireUser } from '@/features/auth/session';
import { toActionError, type ActionState } from '@/lib/action-result';
import { parseLocalDateTime } from '@/lib/time';
import { createBooking } from './service';

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
