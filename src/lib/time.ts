const TIMEZONE = 'America/Sao_Paulo';

export function parseLocalDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-03:00`);
}

export function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(value);
}
