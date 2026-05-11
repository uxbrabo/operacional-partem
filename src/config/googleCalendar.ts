export const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar';
export const CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

export const EVENT_TYPES = {
  captacao:    { label: 'Captação',      color: '#2D9D4E', bg: '#F0FDF4', text: '#166534' },
  reuniao:     { label: 'Reunião',       color: '#1565C0', bg: '#EFF6FF', text: '#1565C0' },
  apresentacao:{ label: 'Apresentação',  color: '#7B1FA2', bg: '#FAF5FF', text: '#6B21A8' },
  followup:    { label: 'Follow-up',     color: '#D97706', bg: '#FFFBEB', text: '#92400E' },
  outro:       { label: 'Outro',         color: '#6B7280', bg: '#F3F4F6', text: '#374151' },
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string;
  location?: string;
  googleEventId?: string;
};

export type GoogleApiEvent = {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end:   { dateTime?: string; date?: string };
  extendedProperties?: { private?: { eventType?: string } };
};

export function mapGoogleEvent(g: GoogleApiEvent): CalendarEvent {
  const isAllDay = !g.start.dateTime;
  const type = (g.extendedProperties?.private?.eventType as EventType) ?? 'outro';
  return {
    id: g.id,
    googleEventId: g.id,
    title: g.summary ?? '(Sem título)',
    type: EVENT_TYPES[type] ? type : 'outro',
    start: new Date(g.start.dateTime ?? g.start.date ?? ''),
    end:   new Date(g.end.dateTime   ?? g.end.date   ?? ''),
    allDay: isAllDay,
    description: g.description,
    location: g.location,
  };
}

export function buildGoogleBody(event: Omit<CalendarEvent, 'id' | 'googleEventId'>) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const start = event.allDay
    ? { date: event.start.toISOString().slice(0, 10) }
    : { dateTime: event.start.toISOString(), timeZone: tz };
  const end = event.allDay
    ? { date: event.end.toISOString().slice(0, 10) }
    : { dateTime: event.end.toISOString(), timeZone: tz };
  return {
    summary: event.title,
    description: event.description ?? '',
    location: event.location ?? '',
    start,
    end,
    extendedProperties: { private: { eventType: event.type } },
  };
}

const LS_EVENTS_KEY = 'partem_calendar_events';
const LS_CLIENT_KEY = 'partem_google_client_id';

export function loadLocalEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(LS_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<CalendarEvent & { start: string; end: string }>;
    return parsed.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }));
  } catch {
    return [];
  }
}

export function saveLocalEvents(events: CalendarEvent[]) {
  localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(events));
}

export function getStoredClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID ?? localStorage.getItem(LS_CLIENT_KEY) ?? '';
}

export function saveClientId(id: string) {
  localStorage.setItem(LS_CLIENT_KEY, id);
}
