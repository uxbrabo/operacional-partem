import { useState, useMemo, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Chip, IconButton, Paper, Alert, Tooltip,
  FormControlLabel, Switch, CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import SyncIcon from '@mui/icons-material/Sync';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import { AppLayout } from '../components/layout/AppLayout';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import {
  EVENT_TYPES, type CalendarEvent, type EventType,
  loadLocalEvents, saveLocalEvents, getStoredClientId, saveClientId,
} from '../config/googleCalendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// ─── date-fns localizer ──────────────────────────────────────────────────────
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { 'pt-BR': ptBR } });

const MESSAGES = {
  allDay: 'Dia inteiro', previous: 'Anterior', next: 'Próximo', today: 'Hoje',
  month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda',
  date: 'Data', time: 'Hora', event: 'Evento', noEventsInRange: 'Nenhum evento neste período.',
  showMore: (n: number) => `+${n} mais`,
};

const PT_FORMATS = {
  monthHeaderFormat: (d: Date) => format(d, "MMMM 'de' yyyy", { locale: ptBR }),
  weekHeaderFormat: (range: { start: Date; end: Date }) =>
    `${format(range.start, "d 'de' MMM", { locale: ptBR })} – ${format(range.end, "d 'de' MMM", { locale: ptBR })}`,
  dayHeaderFormat: (d: Date) => format(d, "EEEE, d 'de' MMMM", { locale: ptBR }),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "d MMM", { locale: ptBR })} – ${format(end, "d MMM yyyy", { locale: ptBR })}`,
};

// ─── Form helpers ─────────────────────────────────────────────────────────────
type FormState = {
  title: string; type: EventType; date: string;
  startTime: string; endTime: string; allDay: boolean;
  description: string; location: string;
};

const EMPTY_FORM: FormState = {
  title: '', type: 'reuniao', date: format(new Date(), 'yyyy-MM-dd'),
  startTime: '09:00', endTime: '10:00', allDay: false,
  description: '', location: '',
};

function formToEvent(f: FormState, id: string, googleEventId?: string): CalendarEvent {
  const startStr = f.allDay ? `${f.date}T00:00:00` : `${f.date}T${f.startTime}:00`;
  const endStr   = f.allDay ? `${f.date}T23:59:59` : `${f.date}T${f.endTime}:00`;
  return {
    id, googleEventId,
    title: f.title, type: f.type,
    start: new Date(startStr), end: new Date(endStr),
    allDay: f.allDay, description: f.description, location: f.location,
  };
}

function eventToForm(e: CalendarEvent): FormState {
  return {
    title: e.title, type: e.type,
    date: format(e.start, 'yyyy-MM-dd'),
    startTime: format(e.start, 'HH:mm'),
    endTime: format(e.end, 'HH:mm'),
    allDay: e.allDay,
    description: e.description ?? '',
    location: e.location ?? '',
  };
}

// ─── Custom event component ───────────────────────────────────────────────────
function EventChip({ event }: { event: CalendarEvent }) {
  const cfg = EVENT_TYPES[event.type];
  return (
    <Box
      sx={{
        bgcolor: cfg.color, color: '#fff',
        px: 0.75, py: 0.25, borderRadius: 1,
        fontSize: '0.72rem', fontWeight: 600,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {event.title}
    </Box>
  );
}

// ─── Event detail popover ─────────────────────────────────────────────────────
function EventDetailDialog({
  event, onClose, onEdit, onDelete,
}: {
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (e: CalendarEvent) => void;
  onDelete: (e: CalendarEvent) => void;
}) {
  if (!event) return null;
  const cfg = EVENT_TYPES[event.type];
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>{event.title}</Typography>
        <Chip label={cfg.label} size="small" sx={{ bgcolor: alpha(cfg.color, 0.12), color: cfg.color, fontWeight: 700, fontSize: '0.65rem' }} />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">
              {format(event.start, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {!event.allDay && ` · ${format(event.start, 'HH:mm')} – ${format(event.end, 'HH:mm')}`}
              {event.allDay && ' · Dia inteiro'}
            </Typography>
          </Box>
          {event.location && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
              <Typography variant="body2">{event.location}</Typography>
            </Box>
          )}
          {event.description && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <NotesIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
              <Typography variant="body2" sx={{ color: 'text.primary' }}>{event.description}</Typography>
            </Box>
          )}
          {event.googleEventId && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <LinkIcon sx={{ fontSize: 14, color: '#2D9D4E' }} />
              <Typography variant="caption" sx={{ color: '#2D9D4E', fontSize: '0.68rem' }}>Sincronizado com Google Calendar</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <IconButton size="small" onClick={() => onDelete(event)} sx={{ color: 'error.main', mr: 'auto' }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Button onClick={onClose} color="inherit" size="small">Fechar</Button>
        <Button variant="contained" size="small" startIcon={<EditIcon />} onClick={() => { onClose(); onEdit(event); }}>
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Google Client ID setup dialog ────────────────────────────────────────────
function ClientIdDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (id: string) => void }) {
  const [value, setValue] = useState(getStoredClientId());
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Conectar ao Google Calendar</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
          <strong>Como configurar:</strong><br />
          1. Acesse <strong>console.cloud.google.com</strong><br />
          2. Crie um projeto e ative a <strong>Google Calendar API</strong><br />
          3. Em <strong>Credenciais</strong>, crie um <strong>OAuth 2.0 Client ID</strong> (Aplicação Web)<br />
          4. Adicione <strong>{window.location.origin}</strong> como origem autorizada<br />
          5. Cole o Client ID abaixo
        </Alert>
        <TextField
          fullWidth size="small" label="Google OAuth Client ID"
          value={value} onChange={(e) => setValue(e.target.value)}
          placeholder="000000000000-xxxxxxxxxxxxxxxx.apps.googleusercontent.com"
          helperText="O Client ID será salvo localmente no navegador."
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button variant="contained" disabled={!value.trim()} onClick={() => { saveClientId(value.trim()); onSave(value.trim()); }}>
          Salvar e conectar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Event form dialog ────────────────────────────────────────────────────────
function EventFormDialog({
  open, onClose, onSave, initial, title,
}: {
  open: boolean; onClose: () => void;
  onSave: (f: FormState) => void;
  initial: FormState; title: string;
}) {
  const [form, setForm] = useState<FormState>(initial);

  // Reset form whenever dialog opens
  useMemo(() => { if (open) setForm(initial); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth size="small" label="Título *"
            value={form.title} onChange={(e) => set('title', e.target.value)}
          />
          <TextField
            fullWidth size="small" label="Tipo" select
            value={form.type} onChange={(e) => set('type', e.target.value as EventType)}
          >
            {Object.entries(EVENT_TYPES).map(([k, v]) => (
              <MenuItem key={k} value={k}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: v.color }} />
                  {v.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth size="small" label="Data" type="date"
            value={form.date} onChange={(e) => set('date', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControlLabel
            control={<Switch checked={form.allDay} onChange={(e) => set('allDay', e.target.checked)} size="small" />}
            label="Dia inteiro"
          />
          {!form.allDay && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                size="small" label="Início" type="time"
                value={form.startTime} onChange={(e) => set('startTime', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                size="small" label="Término" type="time"
                value={form.endTime} onChange={(e) => set('endTime', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          )}
          <TextField
            fullWidth size="small" label="Local"
            value={form.location} onChange={(e) => set('location', e.target.value)}
            placeholder="Endereço ou link da reunião"
          />
          <TextField
            fullWidth size="small" label="Descrição" multiline rows={3}
            value={form.description} onChange={(e) => set('description', e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={!form.title.trim()}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function CalendarPage() {
  const [clientId, setClientId] = useState(getStoredClientId);
  const [setupOpen, setSetupOpen] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(loadLocalEvents);

  // Event dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<FormState>(EMPTY_FORM);
  const [formTitle, setFormTitle] = useState('Novo Evento');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  const gcal = useGoogleCalendar(clientId);

  const allEvents: CalendarEvent[] = useMemo(() =>
    gcal.isConnected ? gcal.googleEvents : localEvents,
    [gcal.isConnected, gcal.googleEvents, localEvents],
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const openCreate = useCallback((date?: Date) => {
    const d = date ?? new Date();
    setFormInitial({ ...EMPTY_FORM, date: format(d, 'yyyy-MM-dd') });
    setFormTitle('Novo Evento');
    setEditingEvent(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((e: CalendarEvent) => {
    setFormInitial(eventToForm(e));
    setFormTitle('Editar Evento');
    setEditingEvent(e);
    setFormOpen(true);
  }, []);

  const handleFormSave = useCallback(async (f: FormState) => {
    setFormOpen(false);
    const tempId = editingEvent?.id ?? `local_${Date.now()}`;
    const built = formToEvent(f, tempId, editingEvent?.googleEventId);

    if (gcal.isConnected) {
      try {
        if (editingEvent?.googleEventId) {
          await gcal.updateEvent({ ...built, id: editingEvent.id, googleEventId: editingEvent.googleEventId });
        } else {
          await gcal.createEvent(built);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setLocalEvents((prev) => {
        const updated = editingEvent
          ? prev.map((x) => x.id === editingEvent.id ? built : x)
          : [...prev, built];
        saveLocalEvents(updated);
        return updated;
      });
    }
    setEditingEvent(null);
  }, [editingEvent, gcal]);

  const handleDelete = useCallback(async (e: CalendarEvent) => {
    setDetailEvent(null);
    if (gcal.isConnected && e.googleEventId) {
      try { await gcal.deleteEvent(e.googleEventId); } catch (err) { console.error(err); }
    } else {
      setLocalEvents((prev) => {
        const updated = prev.filter((x) => x.id !== e.id);
        saveLocalEvents(updated);
        return updated;
      });
    }
  }, [gcal]);

  const handleSetupSave = useCallback((id: string) => {
    setClientId(id);
    setSetupOpen(false);
    setTimeout(() => gcal.connect(), 500);
  }, [gcal]);

  // ─── Big Calendar event renderer ────────────────────────────────────────────
  const components = useMemo(() => ({
    event: ({ event }: { event: CalendarEvent }) => <EventChip event={event} />,
  }), []);

  const eventPropGetter = useCallback((_event: CalendarEvent) => ({
    style: { backgroundColor: 'transparent', border: 'none', padding: 0 },
  }), []);

  return (
    <AppLayout title="Calendário" subtitle="Captações, reuniões e compromissos">

      {/* Error banner */}
      {gcal.error && (
        <Alert severity="error" onClose={() => {}} sx={{ mb: 2 }}>
          {gcal.error}
        </Alert>
      )}

      {/* Not-connected notice */}
      {!gcal.isConnected && !clientId && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button size="small" startIcon={<LinkIcon />} onClick={() => setSetupOpen(true)}>
              Configurar
            </Button>
          }
        >
          Conecte o Google Calendar para sincronizar eventos automaticamente.
        </Alert>
      )}

      {/* Toolbar */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, px: 2, py: 1.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => setCurrentDate((d) => subMonths(d, 1))}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, minWidth: 160, textAlign: 'center', textTransform: 'capitalize' }}>
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </Typography>
          <IconButton size="small" onClick={() => setCurrentDate((d) => addMonths(d, 1))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>

        <Button size="small" variant="outlined" startIcon={<TodayIcon />} onClick={() => setCurrentDate(new Date())} sx={{ fontSize: '0.75rem' }}>
          Hoje
        </Button>

        {/* View toggle */}
        <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', ml: 0.5 }}>
          {(['month', 'week', 'day', 'agenda'] as const).map((v) => (
            <Box
              key={v}
              onClick={() => setView(v)}
              sx={(theme) => ({
                px: 1.5, py: 0.5, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                bgcolor: view === v ? theme.palette.text.primary : 'transparent',
                color: view === v ? theme.palette.background.paper : 'text.primary',
                '&:hover': { bgcolor: view === v ? theme.palette.text.primary : 'action.hover' },
                transition: 'all 0.15s',
              })}
            >
              {{ month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda' }[v]}
            </Box>
          ))}
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Legend chips */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.75, flexWrap: 'wrap' }}>
          {Object.entries(EVENT_TYPES).map(([k, v]) => (
            <Chip key={k} label={v.label} size="small"
              sx={{ height: 20, fontSize: '0.62rem', fontWeight: 700, bgcolor: alpha(v.color, 0.12), color: v.color }} />
          ))}
        </Box>

        {/* Google Calendar button */}
        {gcal.isConnected ? (
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            <Tooltip title="Sincronizar agora">
              <IconButton size="small" onClick={() => gcal.syncEvents()} disabled={gcal.isSyncing}>
                <SyncIcon fontSize="small" sx={{ animation: gcal.isSyncing ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
              </IconButton>
            </Tooltip>
            <Chip
              icon={<LinkIcon sx={{ fontSize: '14px !important' }} />}
              label="Google Calendar"
              size="small"
              color="success"
              onDelete={gcal.disconnect}
              deleteIcon={<LinkOffIcon />}
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
        ) : (
          <Button
            size="small" variant="outlined" startIcon={gcal.isSyncing ? <CircularProgress size={12} /> : <LinkIcon />}
            onClick={() => clientId ? gcal.connect() : setSetupOpen(true)}
            sx={{ fontSize: '0.75rem' }}
          >
            {clientId ? 'Conectar Google' : 'Configurar Google'}
          </Button>
        )}

        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openCreate()}>
          Novo Evento
        </Button>
      </Paper>

      {/* Calendar */}
      <Paper
        elevation={0}
        sx={(theme) => {
          const border = theme.palette.divider;
          const isDark = theme.palette.mode === 'dark';
          return {
            border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden',
            '& .rbc-calendar': { fontFamily: 'inherit', fontSize: '0.85rem' },
            '& .rbc-header': { fontWeight: 700, color: theme.palette.text.secondary, py: 1.25, borderColor: border, bgcolor: isDark ? theme.palette.background.default : '#FAFAFA', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 },
            '& .rbc-month-view': { borderColor: border },
            '& .rbc-month-row': { borderColor: border },
            '& .rbc-day-bg': { borderColor: border },
            '& .rbc-day-bg.rbc-today': { bgcolor: isDark ? alpha('#2D9D4E', 0.10) : '#F0FDF4' },
            '& .rbc-off-range-bg': { bgcolor: isDark ? alpha(theme.palette.common.black, 0.2) : '#FAFAFA' },
            '& .rbc-date-cell': { py: 0.75, px: 1, color: theme.palette.text.secondary, fontSize: '0.8rem', fontWeight: 500 },
            '& .rbc-date-cell.rbc-now': { '& button': { bgcolor: theme.palette.text.primary, color: theme.palette.background.paper, borderRadius: '50%', width: 26, height: 26, fontWeight: 700 } },
            '& .rbc-row-content': { zIndex: 1 },
            '& .rbc-show-more': { color: theme.palette.primary.main, fontWeight: 600, fontSize: '0.7rem' },
            '& .rbc-event': { bgcolor: 'transparent !important', border: 'none !important', p: '1px 2px' },
            '& .rbc-event.rbc-selected': { bgcolor: 'transparent !important' },
            '& .rbc-event-content': { p: 0 },
            '& .rbc-toolbar': { display: 'none' },
            '& .rbc-time-view': { borderColor: border },
            '& .rbc-time-header': { borderColor: border },
            '& .rbc-time-slot': { borderColor: isDark ? alpha(border, 0.5) : '#F3F4F6' },
            '& .rbc-timeslot-group': { borderColor: border, minHeight: 40 },
            '& .rbc-current-time-indicator': { bgcolor: '#2D9D4E', height: 2 },
            '& .rbc-agenda-view table': { borderColor: border },
            '& .rbc-agenda-date-cell, & .rbc-agenda-time-cell': { fontWeight: 700, fontSize: '0.75rem', color: theme.palette.text.secondary },
          };
        }}
      >
        <BigCalendar
          localizer={localizer}
          culture="pt-BR"
          events={allEvents}
          view={view}
          date={currentDate}
          onNavigate={setCurrentDate}
          onView={(v: string) => setView(v as typeof view)}
          messages={MESSAGES}
          formats={PT_FORMATS}
          components={components}
          eventPropGetter={eventPropGetter as (e: object) => object}
          onSelectEvent={(e: object) => setDetailEvent(e as CalendarEvent)}
          onSelectSlot={(slot: { start: Date | string }) => openCreate(new Date(slot.start))}
          selectable
          style={{ minHeight: 620 }}
          popup
        />
      </Paper>

      {/* Dialogs */}
      <EventFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
        initial={formInitial}
        title={formTitle}
      />

      <EventDetailDialog
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <ClientIdDialog
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onSave={handleSetupSave}
      />
    </AppLayout>
  );
}
