import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getDb } from '@/db/client';
import { users, type User } from '@/db/schema';
import { UnauthenticatedError } from '@/lib/errors';

const COOKIE = 'userId';

export async function getCurrentUser(): Promise<User | null> {
  const id = Number((await cookies()).get(COOKIE)?.value);
  if (!id) return null;
  return getDb().select().from(users).where(eq(users.id, id)).get() ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user)
    throw new UnauthenticatedError('Escolha um usuário em «Entrar como».');
  return user;
}

export async function requireAdminPage(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') notFound();
  return user;
}

export async function setSessionUser(id: number): Promise<void> {
  (await cookies()).set(COOKIE, String(id), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
