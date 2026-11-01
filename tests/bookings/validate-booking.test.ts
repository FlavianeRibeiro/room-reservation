import { describe, expect, it } from 'vitest';
import { validateBooking } from '@/features/bookings/domain/validate-booking';
import { ValidationError } from '@/lib/errors';

const NOW = new Date('2026-11-03T12:00:00-03:00');
const at = (time: string, day = '2026-11-04') =>
  new Date(`${day}T${time}:00-03:00`);
const check = (start: Date, end: Date) => () =>
  validateBooking({ start, end }, NOW);

describe('validateBooking', () => {
  it('aceita de 15 minutos a 4 horas', () => {
    expect(check(at('09:00'), at('09:15'))).not.toThrow();
    expect(check(at('09:00'), at('13:00'))).not.toThrow();
  });
  it('rejeita menos de 15 minutos', () => {
    expect(check(at('09:00'), at('09:14'))).toThrow(ValidationError);
  });
  it('rejeita mais de 4 horas', () => {
    expect(check(at('09:00'), at('13:01'))).toThrow(ValidationError);
  });
  it('rejeita fim antes do início', () => {
    expect(check(at('10:00'), at('09:00'))).toThrow(ValidationError);
  });
  it('rejeita reserva no passado', () => {
    expect(check(at('09:00', '2026-11-03'), at('10:00', '2026-11-03'))).toThrow(
      ValidationError,
    );
  });
  it('rejeita datas inválidas', () => {
    expect(check(new Date('x'), at('10:00'))).toThrow(ValidationError);
  });
});
