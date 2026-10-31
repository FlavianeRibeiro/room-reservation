'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getDb } from '@/db/client';
import { users } from '@/db/schema';
import { clearSession, setSessionUser } from './session';

export async function loginAs(formData: FormData) {
  const id = Number(formData.get('userId'));
  const user = getDb().select().from(users).where(eq(users.id, id)).get();
  if (user) await setSessionUser(user.id);
  else await clearSession();
  redirect('/rooms');
}
