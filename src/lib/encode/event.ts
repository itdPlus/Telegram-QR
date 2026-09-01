import type {EventState} from '@/core/types';

const toIcsDateTime = (date: string, time: string): string => {
  if(!date) return '';
  const [year, month, day] = date.split('-');
  const [hours, minutes] = (time || '00:00').split(':');
  return `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`;
};

const escapeIcsValue = (value: string): string => {
  return value.replace(/([\\,;])/g, '\\$1').replace(/\n/g, '\\n');
};

export function encodeEvent(state: EventState): string {
  const hasContent = state.title.trim() || state.description.trim() || state.startDate || state.endDate;
  if(!hasContent) return '';

  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT'];

  lines.push(`SUMMARY:${escapeIcsValue(state.title || 'Событие')}`);
  if(state.description.trim()) lines.push(`DESCRIPTION:${escapeIcsValue(state.description)}`);

  const start = toIcsDateTime(state.startDate, state.startTime);
  if(start) lines.push(`DTSTART:${start}`);

  const end = toIcsDateTime(state.endDate, state.endTime);
  if(end) lines.push(`DTEND:${end}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\n');
}
