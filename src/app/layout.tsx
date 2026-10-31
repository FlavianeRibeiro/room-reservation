import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import User from '@/components/user';
import { getCurrentUser } from '@/features/auth/session';

export const metadata: Metadata = { title: 'Reserva de Salas' };

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 px-6 py-3 text-white">
          <nav className="flex gap-4">
            <Link href="/rooms">Salas</Link>
            <Link href="/my-bookings">Minhas reservas</Link>
            {user?.role === 'admin' && <Link href="/admin/rooms">Admin</Link>}
          </nav>
          <User />
        </header>
        <main className="mx-auto my-6 max-w-4xl px-6">{children}</main>
      </body>
    </html>
  );
}
