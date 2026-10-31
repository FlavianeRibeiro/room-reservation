import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDb } from './client';

migrate(createDb(), { migrationsFolder: './src/db/migrations' });
console.log('Migrations aplicadas.');
