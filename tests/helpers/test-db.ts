import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDb } from '@/db/client';
import { rooms, users } from '@/db/schema';

export function makeTestDb() {
  const db = createDb(':memory:');
  migrate(db, { migrationsFolder: './src/db/migrations' });

  const [ana, bruno, admin] = db
    .insert(users)
    .values([
      { name: 'Ana', email: 'ana@t.com', role: 'user' },
      { name: 'Bruno', email: 'bruno@t.com', role: 'user' },
      { name: 'Admin', email: 'admin@t.com', role: 'admin' },
    ])
    .returning()
    .all();

  const [room, otherRoom] = db
    .insert(rooms)
    .values([
      { name: 'Sala Teste', capacity: 10 },
      { name: 'Sala Outra', capacity: 4 },
    ])
    .returning()
    .all();

  return { db, ana, bruno, admin, room, otherRoom };
}
