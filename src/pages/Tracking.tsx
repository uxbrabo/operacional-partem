import { useState, useMemo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Chip, LinearProgress, Tooltip, alpha,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import PendingIcon from '@mui/icons-material/Pending';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { AppLayout } from '../components/layout/AppLayout';
import { FilterBar } from '../components/common/FilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { MethodBadge } from '../components/common/MethodBadge';
import { RenewalBadge } from '../components/common/RenewalBadge';
import { KPICard } from '../components/common/KPICard';
import { ClientDrawer } from '../components/clients/ClientDrawer';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { useClients } from '../hooks/useClients';
import { formatCurrency, formatDays } from '../utils/formatters';
import {
  getActiveClients, getCanceledClients, getCompletedClients,
  getOverdueClients, getWaitingApprovalClients, getClientsByRenewal,
  getTotalReceived, getTotalPending, isClientOverdue, isClientCanceled,
} from '../utils/calculations';
import type { Client } from '../types';

type SortKey = 'name' | 'daysToDelivery' | 'receivedAmount' | 'pendingAmount' | 'completedStages';
type SortDir = 'asc' | 'desc';

const DEFAULT_FILTERS = {
  search: '', consultant: 'Todos', method: 'Todos',
  entryMonth: 'Todos', renewalMonth: 'Todos',
  stageStatus: 'Todos', willRenew: 'Todos', overdue: false,
};

export function Tracking() {
  const { clients, filteredClients, loading, filters, setFilters } = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('daysToDelivery');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;
      if (typeof av === 'string') return av.localeCompare(bv) * mul;
      return (av - bv) * mul;
    });
  }, [filteredClients, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const stats = useMemo(() => ({
    active: getActiveClients(clients).length,
    canceled: getCanceledClients(clients).length,
    completed: getCompletedClients(clients).length,
    overdue: getOverdueClients(clients).length,
    approval: getWaitingApprovalClients(clients).length,
    received: getTotalReceived(clients),
    pending: getTotalPending(clients),
    willRenew: getClientsByRenewal(clients, 'SIM').length,
    maybeRenew: getClientsByRenewal(clients, 'TALVEZ').length,
    wontRenew: getClientsByRenewal(clients, 'NÃO').length,
  }), [clients]);

  if (loading) return (
    <AppLayout title="Acompanhamento">
      <LoadingState message="Carregando clientes..." />
    </AppLayout>
  );

  return (
    <AppLayout title="Acompanhamento" subtitle="Base principal de clientes">
      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Ativos', value: stats.active, icon: <PeopleIcon sx={{ fontSize: 18 }} />, color: '#1565C0' },
          { title: 'Concluídos', value: stats.completed, icon: <CheckCircleIcon sx={{ fontSize: 18 }} />, color: '#2D9D4E' },
          { title: 'Cancelados', value: stats.canceled, icon: <CancelIcon sx={{ fontSize: 18 }} />, color: '#DC2626' },
          { title: 'Atrasados', value: stats.overdue, icon: <WarningIcon sx={{ fontSize: 18 }} />, color: '#DC2626' },
          { title: 'Em aprovação', value: stats.approval, icon: <PendingIcon sx={{ fontSize: 18 }} />, color: '#F57C00' },
          { title: 'Já recebido', value: formatCurrency(stats.received), icon: <AutorenewIcon sx={{ fontSize: 18 }} />, color: '#2D9D4E' },
          { title: 'A receber', value: formatCurrency(stats.pending), icon: <AutorenewIcon sx={{ fontSize: 18 }} />, color: '#F57C00' },
          { title: 'Vão renovar', value: stats.willRenew, color: '#2D9D4E' },
          { title: 'Talvez', value: stats.maybeRenew, color: '#F57C00' },
          { title: 'Não renovam', value: stats.wontRenew, color: '#DC2626' },
        ].map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 6, sm: 4, md: 2 }}>
            <KPICard title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} sx={{ py: 0.5 }} />
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <FilterBar
            filters={filters}
            onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
            Clientes
          </Typography>
          <Chip label={`${sorted.length} resultado${sorted.length !== 1 ? 's' : ''}`} size="small" sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 600 }} />
        </Box>
        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 180 }}>
                  <TableSortLabel active={sortKey === 'name'} direction={sortKey === 'name' ? sortDir : 'asc'} onClick={() => handleSort('name')}>
                    Cliente
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ minWidth: 80 }}>Mês</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Método</TableCell>
                <TableCell sx={{ minWidth: 80 }}>E1</TableCell>
                <TableCell sx={{ minWidth: 80 }}>E2</TableCell>
                <TableCell sx={{ minWidth: 80 }}>E3</TableCell>
                <TableCell sx={{ minWidth: 80 }}>E4</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Coordenador</TableCell>
                <TableCell align="center" sx={{ minWidth: 70 }}>
                  <TableSortLabel active={sortKey === 'completedStages'} direction={sortKey === 'completedStages' ? sortDir : 'asc'} onClick={() => handleSort('completedStages')}>
                    Etapas
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 100 }}>
                  <TableSortLabel active={sortKey === 'receivedAmount'} direction={sortKey === 'receivedAmount' ? sortDir : 'asc'} onClick={() => handleSort('receivedAmount')}>
                    Recebido
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 100 }}>
                  <TableSortLabel active={sortKey === 'pendingAmount'} direction={sortKey === 'pendingAmount' ? sortDir : 'asc'} onClick={() => handleSort('pendingAmount')}>
                    A receber
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ minWidth: 80 }}>Renovação</TableCell>
                <TableCell align="center" sx={{ minWidth: 80 }}>
                  <TableSortLabel active={sortKey === 'daysToDelivery'} direction={sortKey === 'daysToDelivery' ? sortDir : 'asc'} onClick={() => handleSort('daysToDelivery')}>
                    Dias
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 70 }}>Renova?</TableCell>
                <TableCell align="center" sx={{ minWidth: 40 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15}>
                    <EmptyState title="Nenhum cliente encontrado" description="Tente ajustar os filtros." />
                  </TableCell>
                </TableRow>
              ) : sorted.map((c: Client) => {
                const overdue = isClientOverdue(c);
                const canceled = isClientCanceled(c);
                const rowBg = overdue ? alpha('#DC2626', 0.04)
                  : canceled ? alpha('#6B7280', 0.04)
                  : c.stages.e1.status === 'Em aprovação' || c.stages.e2.status === 'Em aprovação' ? alpha('#F57C00', 0.04)
                  : 'transparent';
                return (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => setSelectedClient(c)}
                    sx={{ bgcolor: rowBg, cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        {overdue && <Tooltip title="Atrasado"><WarningIcon sx={{ fontSize: 14, color: '#DC2626' }} /></Tooltip>}
                        <Typography variant="body2" sx={{ fontWeight: 600, color: canceled ? 'text.disabled' : 'text.primary' }}>
                          {c.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                        {c.entryMonth.charAt(0) + c.entryMonth.slice(1).toLowerCase()}
                      </Typography>
                    </TableCell>
                    <TableCell><MethodBadge method={c.method} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e1.status} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e2.status} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e3.status} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e4.status} /></TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {c.consultant || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.completedStages}/4</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(c.completedStages / 4) * 100}
                          sx={{ width: 32 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D9D4E' }}>
                        {formatCurrency(c.receivedAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#F57C00' }}>
                        {formatCurrency(c.pendingAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.renewalMonth || '—'}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {c.daysToDelivery !== 0 || c.renewalMonth ? (
                        <Chip
                          label={formatDays(c.daysToDelivery)}
                          size="small"
                          sx={{
                            height: 20,
                            bgcolor: overdue ? alpha('#DC2626', 0.10) : c.daysToDelivery <= 7 ? alpha('#F57C00', 0.10) : 'action.hover',
                            color: overdue ? '#DC2626' : c.daysToDelivery <= 7 ? '#F57C00' : 'text.secondary',
                            fontWeight: 700, fontSize: '0.65rem',
                          }}
                        />
                      ) : <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>}
                    </TableCell>
                    <TableCell align="center"><RenewalBadge status={c.willRenew} /></TableCell>
                    <TableCell align="center">
                      <OpenInNewIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ClientDrawer
        client={selectedClient}
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </AppLayout>
  );
}
