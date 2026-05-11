import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, Grid,
  Typography, Divider, Alert,
} from '@mui/material';
import type { Client, Method, ConsultantName, EntryMonth, RenewalStatus, StageStatus, ClientStages } from '../../types';

const MONTHS: EntryMonth[] = [
  'JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO',
  'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO',
];
export const METHODS: Method[] = ['SABOR', 'CLÍNICA 360', 'CLÍNICA 180'];
export const CONSULTANT_NAMES: ConsultantName[] = ['LUCAS', 'RODRIGO', ''];
export const STAGE_STATUSES: StageStatus[] = ['Não iniciada', 'Em execução', 'Em aprovação', 'Concluído', 'Cancelado'];

export type ClientFormState = {
  name: string; phone: string; email: string;
  method: string; consultant: string; socialMedia: string; designer: string;
  entryMonth: string; renewalMonth: string; willRenew: string;
  receivedAmount: string; pendingAmount: string; daysToDelivery: string; notes: string;
  e1Status: StageStatus; e1Date: string; e1ReceivedDate: string;
  e2Status: StageStatus; e2Date: string; e2ReceivedDate: string;
  e3Status: StageStatus; e3Date: string; e3ReceivedDate: string;
  e4Status: StageStatus; e4Date: string; e4ReceivedDate: string;
};

export const EMPTY_CLIENT_FORM: ClientFormState = {
  name: '', phone: '', email: '',
  method: '', consultant: '', socialMedia: '', designer: '',
  entryMonth: '', renewalMonth: '', willRenew: '',
  receivedAmount: '0', pendingAmount: '0', daysToDelivery: '0', notes: '',
  e1Status: 'Não iniciada', e1Date: '', e1ReceivedDate: '',
  e2Status: 'Não iniciada', e2Date: '', e2ReceivedDate: '',
  e3Status: 'Não iniciada', e3Date: '', e3ReceivedDate: '',
  e4Status: 'Não iniciada', e4Date: '', e4ReceivedDate: '',
};

export function clientToForm(c: Client): ClientFormState {
  return {
    name: c.name, phone: c.phone ?? '', email: c.email ?? '',
    method: c.method, consultant: c.consultant,
    socialMedia: c.socialMedia ?? '', designer: c.designer ?? '',
    entryMonth: c.entryMonth, renewalMonth: c.renewalMonth, willRenew: c.willRenew,
    receivedAmount: String(c.receivedAmount), pendingAmount: String(c.pendingAmount),
    daysToDelivery: String(c.daysToDelivery), notes: c.notes,
    e1Status: c.stages.e1.status, e1Date: c.stages.e1.date, e1ReceivedDate: c.stages.e1.receivedDate,
    e2Status: c.stages.e2.status, e2Date: c.stages.e2.date, e2ReceivedDate: c.stages.e2.receivedDate,
    e3Status: c.stages.e3.status, e3Date: c.stages.e3.date, e3ReceivedDate: c.stages.e3.receivedDate,
    e4Status: c.stages.e4.status, e4Date: c.stages.e4.date, e4ReceivedDate: c.stages.e4.receivedDate,
  };
}

export function formToClientData(form: ClientFormState): Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {
  const stages: ClientStages = {
    e1: { status: form.e1Status, date: form.e1Date, receivedDate: form.e1ReceivedDate },
    e2: { status: form.e2Status, date: form.e2Date, receivedDate: form.e2ReceivedDate },
    e3: { status: form.e3Status, date: form.e3Date, receivedDate: form.e3ReceivedDate },
    e4: { status: form.e4Status, date: form.e4Date, receivedDate: form.e4ReceivedDate },
  };
  return {
    name: form.name.trim(),
    phone: form.phone || undefined,
    email: form.email || undefined,
    method: form.method as Method,
    consultant: form.consultant as ConsultantName,
    socialMedia: form.socialMedia || undefined,
    designer: form.designer || undefined,
    entryMonth: form.entryMonth as EntryMonth,
    renewalMonth: form.renewalMonth,
    willRenew: form.willRenew as RenewalStatus,
    stages,
    completedStages: Object.values(stages).filter((s) => s.status === 'Concluído').length,
    receivedAmount: parseFloat(form.receivedAmount) || 0,
    pendingAmount: parseFloat(form.pendingAmount) || 0,
    daysToDelivery: parseInt(form.daysToDelivery) || 0,
    notes: form.notes,
  };
}

function StageRow({ label, status, date, receivedDate, onChange }: {
  label: string;
  status: StageStatus; date: string; receivedDate: string;
  onChange: (field: 'status' | 'date' | 'receivedDate', val: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
      <Typography sx={{ minWidth: 32, fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>
        {label}
      </Typography>
      <FormControl size="small" sx={{ flex: 1 }}>
        <Select value={status} onChange={(e) => onChange('status', e.target.value)}>
          {STAGE_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField
        size="small" label="Data entrega" placeholder="dd/mm/aaaa"
        value={date} onChange={(e) => onChange('date', e.target.value)}
        sx={{ flex: 1 }}
      />
      <TextField
        size="small" label="Data recebimento" placeholder="dd/mm/aaaa"
        value={receivedDate} onChange={(e) => onChange('receivedDate', e.target.value)}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  form: ClientFormState;
  setForm: React.Dispatch<React.SetStateAction<ClientFormState>>;
  title: string;
  errors: string[];
  socialMediaOptions: string[];
  designerOptions: string[];
};

export function ClientForm({ open, onClose, onSave, form, setForm, title, errors, socialMediaOptions, designerOptions }: Props) {
  function set(field: keyof ClientFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setStage(
    stage: 'e1' | 'e2' | 'e3' | 'e4',
    field: 'status' | 'date' | 'receivedDate',
    value: string,
  ) {
    const map = { status: `${stage}Status`, date: `${stage}Date`, receivedDate: `${stage}ReceivedDate` };
    setForm((prev) => ({ ...prev, [map[field]]: value }));
  }

  function handleSave() {
    onSave(formToClientData(form));
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent dividers>
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>{errors.join(' · ')}</Alert>
        )}

        <SectionLabel>Informações básicas</SectionLabel>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Nome do cliente *" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth size="small" label="Telefone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth size="small" label="E-mail" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Método *</InputLabel>
              <Select label="Método *" value={form.method} onChange={(e) => set('method', e.target.value)}>
                {METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Coordenador</InputLabel>
              <Select label="Coordenador" value={form.consultant} onChange={(e) => set('consultant', e.target.value)}>
                <MenuItem value="">Sem coordenador</MenuItem>
                {CONSULTANT_NAMES.filter(Boolean).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Mês de entrada *</InputLabel>
              <Select label="Mês de entrada *" value={form.entryMonth} onChange={(e) => set('entryMonth', e.target.value)}>
                {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Social Media</InputLabel>
              <Select label="Social Media" value={form.socialMedia} onChange={(e) => set('socialMedia', e.target.value)}>
                <MenuItem value="">Não atribuído</MenuItem>
                {socialMediaOptions.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Designer</InputLabel>
              <Select label="Designer" value={form.designer} onChange={(e) => set('designer', e.target.value)}>
                <MenuItem value="">Não atribuído</MenuItem>
                {designerOptions.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Renova?</InputLabel>
              <Select label="Renova?" value={form.willRenew} onChange={(e) => set('willRenew', e.target.value)}>
                <MenuItem value="">—</MenuItem>
                <MenuItem value="SIM">SIM</MenuItem>
                <MenuItem value="NÃO">NÃO</MenuItem>
                <MenuItem value="TALVEZ">TALVEZ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Mês de renovação</InputLabel>
              <Select label="Mês de renovação" value={form.renewalMonth} onChange={(e) => set('renewalMonth', e.target.value)}>
                <MenuItem value="">—</MenuItem>
                {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />
        <SectionLabel>Financeiro</SectionLabel>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size="small" label="Valor recebido (R$)" type="number" value={form.receivedAmount} onChange={(e) => set('receivedAmount', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size="small" label="Valor pendente (R$)" type="number" value={form.pendingAmount} onChange={(e) => set('pendingAmount', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size="small" label="Dias para entrega" type="number" value={form.daysToDelivery} onChange={(e) => set('daysToDelivery', e.target.value)} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />
        <SectionLabel>Etapas</SectionLabel>
        <StageRow label="E1" status={form.e1Status} date={form.e1Date} receivedDate={form.e1ReceivedDate}
          onChange={(f, v) => setStage('e1', f, v)} />
        <StageRow label="E2" status={form.e2Status} date={form.e2Date} receivedDate={form.e2ReceivedDate}
          onChange={(f, v) => setStage('e2', f, v)} />
        <StageRow label="E3" status={form.e3Status} date={form.e3Date} receivedDate={form.e3ReceivedDate}
          onChange={(f, v) => setStage('e3', f, v)} />
        <StageRow label="E4" status={form.e4Status} date={form.e4Date} receivedDate={form.e4ReceivedDate}
          onChange={(f, v) => setStage('e4', f, v)} />

        <Divider sx={{ mb: 3 }} />
        <SectionLabel>Observações</SectionLabel>
        <TextField fullWidth multiline rows={3} size="small" label="Observações" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained">{title.startsWith('Editar') ? 'Salvar alterações' : 'Criar cliente'}</Button>
      </DialogActions>
    </Dialog>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
      {children}
    </Typography>
  );
}
