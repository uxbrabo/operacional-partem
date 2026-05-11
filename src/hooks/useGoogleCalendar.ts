import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GOOGLE_SCOPES, CALENDAR_API,
  mapGoogleEvent, buildGoogleBody,
  type CalendarEvent, type GoogleApiEvent,
} from '../config/googleCalendar';

type TokenCallback = (resp: { error?: string; access_token: string }) => void;
type TokenClient = { requestAccessToken: (opts?: { prompt?: string }) => void };

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: { client_id: string; scope: string; callback: TokenCallback }) => TokenClient;
          revoke: (token: string, done: () => void) => void;
        };
      };
    };
  }
}

export type GCalState = {
  isConnected: boolean;
  isSyncing: boolean;
  isReady: boolean;
  error: string | null;
  googleEvents: CalendarEvent[];
  connect: () => void;
  disconnect: () => void;
  syncEvents: (fromDate?: Date, toDate?: Date) => Promise<void>;
  createEvent: (e: Omit<CalendarEvent, 'id' | 'googleEventId'>) => Promise<CalendarEvent>;
  updateEvent: (e: CalendarEvent) => Promise<CalendarEvent>;
  deleteEvent: (googleEventId: string) => Promise<void>;
};

export function useGoogleCalendar(clientId: string): GCalState {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);

  const tokenRef = useRef<string | null>(null);
  const clientRef = useRef<TokenClient | null>(null);

  const initTokenClient = useCallback(() => {
    if (!clientId || !window.google) return;
    clientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPES,
      callback: async (resp) => {
        if (resp.error) {
          setError(`Erro de autenticação: ${resp.error}`);
          return;
        }
        tokenRef.current = resp.access_token;
        setIsConnected(true);
        setError(null);
        await syncEventsInternal(resp.access_token);
      },
    });
    setIsReady(true);
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    if (window.google) { initTokenClient(); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initTokenClient;
    script.onerror = () => setError('Falha ao carregar Google Identity Services');
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [initTokenClient, clientId]);

  const apiCall = useCallback(async (url: string, opts?: RequestInit) => {
    if (!tokenRef.current) throw new Error('Não autenticado');
    const res = await fetch(url, {
      ...opts,
      headers: {
        Authorization: `Bearer ${tokenRef.current}`,
        'Content-Type': 'application/json',
        ...opts?.headers,
      },
    });
    if (res.status === 401) {
      setIsConnected(false);
      tokenRef.current = null;
      throw new Error('Token expirado. Reconecte o Google Calendar.');
    }
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Erro API Google: ${res.status} — ${msg.slice(0, 120)}`);
    }
    return res.status === 204 ? null : res.json();
  }, []);

  const syncEventsInternal = useCallback(async (token: string, from?: Date, to?: Date) => {
    setIsSyncing(true);
    try {
      const now = new Date();
      const timeMin = (from ?? new Date(now.getFullYear(), now.getMonth() - 1, 1)).toISOString();
      const timeMax = (to   ?? new Date(now.getFullYear(), now.getMonth() + 4, 0)).toISOString();
      const savedToken = tokenRef.current;
      tokenRef.current = token;
      const data = await apiCall(
        `${CALENDAR_API}?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=500`,
      );
      tokenRef.current = savedToken ?? token;
      const items: GoogleApiEvent[] = data?.items ?? [];
      setGoogleEvents(items.map(mapGoogleEvent));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao sincronizar eventos');
    } finally {
      setIsSyncing(false);
    }
  }, [apiCall]);

  const syncEvents = useCallback(async (from?: Date, to?: Date) => {
    if (!tokenRef.current) return;
    await syncEventsInternal(tokenRef.current, from, to);
  }, [syncEventsInternal]);

  const connect = useCallback(() => {
    if (!clientRef.current) { setError('Google Identity Services não carregado ainda.'); return; }
    clientRef.current.requestAccessToken({ prompt: '' });
  }, []);

  const disconnect = useCallback(() => {
    if (tokenRef.current) window.google?.accounts.oauth2.revoke(tokenRef.current, () => {});
    tokenRef.current = null;
    setIsConnected(false);
    setGoogleEvents([]);
  }, []);

  const createEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'googleEventId'>): Promise<CalendarEvent> => {
    const body = buildGoogleBody(event);
    const data = await apiCall(CALENDAR_API, { method: 'POST', body: JSON.stringify(body) });
    const created = mapGoogleEvent(data as GoogleApiEvent);
    setGoogleEvents((prev) => [...prev, created]);
    return created;
  }, [apiCall]);

  const updateEvent = useCallback(async (event: CalendarEvent): Promise<CalendarEvent> => {
    if (!event.googleEventId) throw new Error('Sem googleEventId');
    const body = buildGoogleBody(event);
    const data = await apiCall(`${CALENDAR_API}/${event.googleEventId}`, { method: 'PUT', body: JSON.stringify(body) });
    const updated = mapGoogleEvent(data as GoogleApiEvent);
    setGoogleEvents((prev) => prev.map((e) => e.googleEventId === event.googleEventId ? updated : e));
    return updated;
  }, [apiCall]);

  const deleteEvent = useCallback(async (googleEventId: string): Promise<void> => {
    await apiCall(`${CALENDAR_API}/${googleEventId}`, { method: 'DELETE' });
    setGoogleEvents((prev) => prev.filter((e) => e.googleEventId !== googleEventId));
  }, [apiCall]);

  return { isConnected, isSyncing, isReady, error, googleEvents, connect, disconnect, syncEvents, createEvent, updateEvent, deleteEvent };
}
