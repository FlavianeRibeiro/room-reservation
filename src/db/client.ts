import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export function createDb(file = process.env.DATABASE_URL ?? './data/app.db') {
  if (file !== ':memory:')
    fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}

export type Db = ReturnType<typeof createDb>;

let instance: Db | undefined;
export function getDb(): Db {
  instance ??= createDb();
  return instance;
}
