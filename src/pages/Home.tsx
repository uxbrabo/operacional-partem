import { useMemo, useState } from 'react';
import {
  Box, Card, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Alert, Tabs, Tab, TextField, Select, MenuItem, FormControl,
  InputLabel, InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import { AppLayout } from '../components/layout/AppLayout';
import { MethodBadge } from '../components/common/MethodBadge';
import { RenewalBadge } from '../components/common/RenewalBadge';
import { useClients } from '../hooks/useClients';
import { formatCurrency, formatDays } from '../utils/formatters';
import {
  getOverdueClients, getWeeklyDeliveries,
  getUpcomingRenewals, getWaitingApprovalClients,
} from '../utils/calculations';
import type { Client } from '../types';

const CONSULTANTS = ['Todos', 'LUCAS', 'RODRIGO'];
const METHODS = ['Todos', 'SABOR', 'CLÍNICA 360', 'CLÍNICA 180'];

type TabId = 'atrasados' | 'entregas' | 'renovacoes' | 'aprovacao';

function applyFilters(list: Client[], search: string, consultant: string, method: string): Client[] {
  return list.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (consultant !== 'Todos' && c.consultant !== consultant) return false;
    if (method !== 'Todos' && c.method !== method) return false;
    return true;
  });
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={cols} align="center" sx={{ py: 8, color: 'text.secondary', fontSize: '0.875rem' }}>
        {message}
      </TableCell>
    </TableRow>
  );
}

export function Home() {
  const { clients } = useClients();
  const [tab, setTab] = useState<TabId>('atrasados');
  const [search, setSearch] = useState('');
  const [consultant, setConsultant] = useState('Todos');
  const [method, setMethod] = useState('Todos');

  const overdue = useMemo(() => getOverdueClients(clients), [clients]);
  const weekly = useMemo(() => getWeeklyDeliveries(clients), [clients]);
  const renewals = useMemo(() => getUpcomingRenewals(clients, 'MAIO'), [clients]);
  const approval = useMemo(() => getWaitingApprovalClients(clients), [clients]);

  const currentList = useMemo(() => {
    const base = tab === 'atrasados' ? overdue : tab === 'entregas' ? weekly : tab === 'renovacoes' ? renewals : approval;
    return applyFilters(base, search, consultant, method);
  }, [tab, overdue, weekly, renewals, approval, search, consultant, method]);

  const tabConfig = [
    { id: 'atrasados' as TabId, label: 'Atrasados', count: overdue.length, color: '#DC2626', icon: <WarningAmberIcon sx={{ fontSize: 18 }} /> },
    { id: 'entregas' as TabId, label: 'Entregas da semana', count: weekly.length, color: '#1565C0', icon: <LocalShippingIcon sx={{ fontSize: 18 }} /> },
    { id: 'renovacoes' as TabId, label: 'Renovações', count: renewals.length, color: '#2D9D4E', icon: <AutorenewIcon sx={{ fontSize: 18 }} /> },
    { id: 'aprovacao' as TabId, label: 'Aguardando aprovação', count: approval.length, color: '#F57C00', icon: <PendingIcon sx={{ fontSize: 18 }} /> },
  ];

  const activeConfig = tabConfig.find((t) => t.id === tab)!;

  return (
    <AppLayout
      title="Início"
      subtitle={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
    >
      {/* Alert banner */}
      {overdue.length > 0 ? (
        <Alert
          severity="error"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, borderRadius: 2, cursor: 'pointer' }}
          onClick={() => setTab('atrasados')}
        >
          <strong>{overdue.length} clientes atrasados</strong> requerem atenção imediata. Clique para ver.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          Nenhum cliente atrasado hoje. Ótimo trabalho!
        </Alert>
      )}

      <Card sx={{ overflow: 'visible' }}>
        {/* Tabs row */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setSearch(''); }}
            sx={{
              px: 2,
              '& .MuiTab-root': { minHeight: 52, textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', gap: 0.5 },
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabConfig.map((t) => (
              <Tab
                key={t.id}
                value={t.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: tab === t.id ? t.color : 'text.secondary', display: 'flex' }}>{t.icon}</Box>
                    <span>{t.label}</span>
                    <Chip
                      label={t.count}
                      size="small"
                      sx={{
                        height: 20, minWidth: 24,
                        bgcolor: t.count > 0 ? alpha(t.color, 0.12) : alpha('#6B7280', 0.08),
                        color: t.count > 0 ? t.color : 'text.secondary',
                        fontWeight: 700, fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Filter row */}
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'action.hover', borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200, maxWidth: 320 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Coordenador</InputLabel>
            <Select label="Coordenador" value={consultant} onChange={(e) => setConsultant(e.target.value)}>
              {CONSULTANTS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Método</InputLabel>
            <Select label="Método" value={method} onChange={(e) => setMethod(e.target.value)}>
              {METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: activeConfig.color, display: 'flex' }}>{activeConfig.icon}</Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: activeConfig.color }}>
              {currentList.length} {currentList.length === 1 ? 'item' : 'itens'}
              {currentList.length !== (tab === 'atrasados' ? overdue : tab === 'entregas' ? weekly : tab === 'renovacoes' ? renewals : approval).length
                ? ` (filtrado de ${(tab === 'atrasados' ? overdue : tab === 'entregas' ? weekly : tab === 'renovacoes' ? renewals : approval).length})`
                : ''}
            </Typography>
          </Box>
        </Box>

        {/* Table content */}
        <TableContainer>
          <Table size="small">
            {tab === 'atrasados' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Coordenador</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Mês entrada</TableCell>
                    <TableCell align="center">Atraso</TableCell>
                    <TableCell align="right">A receber</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentList.length === 0 ? (
                    <EmptyRow cols={6} message="Nenhum cliente atrasado encontrado." />
                  ) : currentList.map((c: Client) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.consultant || '—'}</Typography></TableCell>
                      <TableCell><MethodBadge method={c.method} /></TableCell>
                      <TableCell><Typography variant="caption">{c.entryMonth}</Typography></TableCell>
                      <TableCell align="center">
                        <Chip label={formatDays(c.daysToDelivery)} size="small"
                          sx={{ bgcolor: alpha('#DC2626', 0.10), color: '#DC2626', fontWeight: 700, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#F57C00' }}>{formatCurrency(c.pendingAmount)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}

            {tab === 'entregas' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Coordenador</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Renovação</TableCell>
                    <TableCell align="center">Dias</TableCell>
                    <TableCell align="right">A receber</TableCell>
                    <TableCell align="center">Renova?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentList.length === 0 ? (
                    <EmptyRow cols={7} message="Nenhuma entrega encontrada para esta semana." />
                  ) : currentList.map((c: Client) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.consultant || '—'}</Typography></TableCell>
                      <TableCell><MethodBadge method={c.method} /></TableCell>
                      <TableCell><Typography variant="caption">{c.renewalMonth || '—'}</Typography></TableCell>
                      <TableCell align="center">
                        <Chip
                          label={c.daysToDelivery === 0 ? 'Hoje' : formatDays(c.daysToDelivery)}
                          size="small"
                          sx={{
                            bgcolor: c.daysToDelivery <= 3 ? alpha('#F57C00', 0.12) : alpha('#1565C0', 0.12),
                            color: c.daysToDelivery <= 3 ? '#F57C00' : '#1565C0',
                            fontWeight: 700, fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D9D4E' }}>{formatCurrency(c.pendingAmount)}</Typography>
                      </TableCell>
                      <TableCell align="center"><RenewalBadge status={c.willRenew} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}

            {tab === 'renovacoes' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Coordenador</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Mês renovação</TableCell>
                    <TableCell>Etapas concluídas</TableCell>
                    <TableCell align="right">Recebido</TableCell>
                    <TableCell align="center">Renova?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentList.length === 0 ? (
                    <EmptyRow cols={7} message="Nenhuma renovação encontrada." />
                  ) : currentList.map((c: Client) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.consultant || '—'}</Typography></TableCell>
                      <TableCell><MethodBadge method={c.method} /></TableCell>
                      <TableCell>
                        <Chip label={c.renewalMonth || '—'} size="small"
                          sx={{ bgcolor: alpha('#2D9D4E', 0.12), color: '#2D9D4E', fontWeight: 600, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{c.completedStages}/4 etapas</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D9D4E' }}>{formatCurrency(c.receivedAmount)}</Typography>
                      </TableCell>
                      <TableCell align="center"><RenewalBadge status={c.willRenew} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}

            {tab === 'aprovacao' && (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Coordenador</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Mês entrada</TableCell>
                    <TableCell align="center">Etapa em aprovação</TableCell>
                    <TableCell align="right">A receber</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentList.length === 0 ? (
                    <EmptyRow cols={6} message="Nada aguardando aprovação." />
                  ) : currentList.map((c: Client) => {
                    const stageKey = (['e1', 'e2', 'e3', 'e4'] as const).find(
                      (k) => c.stages[k].status === 'Em aprovação',
                    );
                    return (
                      <TableRow key={c.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                        <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.consultant || '—'}</Typography></TableCell>
                        <TableCell><MethodBadge method={c.method} /></TableCell>
                        <TableCell><Typography variant="caption">{c.entryMonth}</Typography></TableCell>
                        <TableCell align="center">
                          <Chip
                            label={stageKey?.toUpperCase() ?? '—'}
                            size="small"
                            sx={{ bgcolor: alpha('#F57C00', 0.12), color: '#F57C00', fontWeight: 700, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#F57C00' }}>{formatCurrency(c.pendingAmount)}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
      </Card>
    </AppLayout>
  );
}
