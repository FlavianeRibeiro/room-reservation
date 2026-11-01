'use client';

import { useActionState } from 'react';
import type { ActionState } from '@/lib/action-result';

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  resources: { id: number; name: string }[];
  room?: {
    name: string;
    capacity: number;
    location: string | null;
    active: boolean;
    resourceIds: number[];
  };
};

export default function RoomForm({ action, resources, room }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="flex max-w-md flex-col gap-3">
      <label className="flex flex-col text-sm">
        Nome
        <input
          name="name"
          defaultValue={room?.name}
          required
          className="rounded border p-2"
        />
      </label>
      <label className="flex flex-col text-sm">
        Capacidade
        <input
          type="number"
          name="capacity"
          min={1}
          defaultValue={room?.capacity}
          required
          className="rounded border p-2"
        />
      </label>
      <label className="flex flex-col text-sm">
        Localização
        <input
          name="location"
          defaultValue={room?.location ?? ''}
          className="rounded border p-2"
        />
      </label>
      <fieldset className="text-sm">
        <legend className="mb-1">Recursos</legend>
        {resources.map((r) => (
          <label key={r.id} className="mr-4 inline-flex items-center gap-1">
            <input
              type="checkbox"
              name="resourceIds"
              value={r.id}
              defaultChecked={room?.resourceIds.includes(r.id)}
            />
            {r.name}
          </label>
        ))}
      </fieldset>
      {room && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={room.active} />
          Sala ativa
        </label>
      )}
      {state?.error && (
        <p role="alert" className="rounded bg-red-100 p-2 text-sm text-red-800">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
