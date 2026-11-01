const TIMEZONE = 'America/Sao_Paulo';

export function parseLocalDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-03:00`);
}

export function formatDateTime(value: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    dateStyle: 'short',
  }).format(value);
}

export function formatTime(value: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Garante o formato de 24 horas
  }).format(value);
}
