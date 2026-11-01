import { ValidationError } from '@/lib/errors';

export const MIN_DURATION_MINUTES = 15;
export const MAX_DURATION_MINUTES = 240; // 4 horas

export function validateBooking(
  input: { start: Date; end: Date },
  now: Date,
): void {
  const start = input.start.getTime();
  const end = input.end.getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new ValidationError('Informe data, início e fim válidos.');
  }
  if (end <= start) {
    throw new ValidationError('O fim deve ser depois do início.');
  }
  if (start < now.getTime()) {
    throw new ValidationError('Não é possível reservar no passado.');
  }

  const minutes = (end - start) / 60000;
  if (minutes < MIN_DURATION_MINUTES) {
    throw new ValidationError('A reserva deve durar pelo menos 15 minutos.');
  }
  if (minutes > MAX_DURATION_MINUTES) {
    throw new ValidationError('A reserva pode durar no máximo 4 horas.');
  }
}
