import { getDb } from '@/db/client';
import { users } from '@/db/schema';
import { loginAs } from '@/features/auth/actions';
import { getCurrentUser } from '@/features/auth/session';

export default async function User() {
  const current = await getCurrentUser();
  const all = getDb().select().from(users).all();
  return (
    <form action={loginAs} className="flex items-center gap-2">
      <label htmlFor="userId">Entrar como:</label>
      <select
        id="userId"
        name="userId"
        defaultValue={current?.id ?? ''}
        className="rounded border px-2 py-1 text-black"
      >
        <option value="">— ninguém —</option>
        {all.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>
      <button className="rounded bg-white px-3 py-1 text-slate-900">
        Entrar
      </button>
    </form>
  );
}
