'use client';

import { useActionState } from 'react';
import { createBookingAction } from '@/features/bookings/actions';

export default function BookingForm({ roomId }: { roomId: number }) {
  const [state, action, pending] = useActionState(
    createBookingAction,
    undefined,
  );
  return (
    <form action={action} className="flex max-w-sm flex-col gap-3">
      <input type="hidden" name="roomId" value={roomId} />
      <label className="flex flex-col text-sm">
        Data
        <input
          type="date"
          name="date"
          required
          className="rounded border p-2"
        />
      </label>
      <label className="flex flex-col text-sm">
        Início
        <input
          type="time"
          name="start"
          required
          className="rounded border p-2"
        />
      </label>
      <label className="flex flex-col text-sm">
        Fim
        <input type="time" name="end" required className="rounded border p-2" />
      </label>
      {state?.error && (
        <p role="alert" className="rounded bg-red-100 p-2 text-sm text-red-800">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Reservando...' : 'Reservar'}
      </button>
    </form>
  );
}
