import type { User } from '@/db/schema';
import { ForbiddenError } from '@/lib/errors';

export function assertAdmin(user: Pick<User, 'role'>): void {
  if (user.role !== 'admin') {
    throw new ForbiddenError('Apenas administradores podem fazer isso.');
  }
}

export function assertCanCancel(
  user: Pick<User, 'id'>,
  booking: { userId: number },
): void {
  if (booking.userId !== user.id) {
    throw new ForbiddenError(
      'Você só pode cancelar as suas próprias reservas.',
    );
  }
}
