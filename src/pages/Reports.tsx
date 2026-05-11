import { useState, useMemo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, FormControl,
  InputLabel, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Alert,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { MethodBadge } from '../components/common/MethodBadge';
import { RenewalBadge } from '../components/common/RenewalBadge';
import { KPICard } from '../components/common/KPICard';
import { useClients } from '../hooks/useClients';
import { formatCurrency, CONSULTANTS, METHODS, ENTRY_MONTHS } from '../utils/formatters';
import {
  getActiveClients, getCanceledClients, getCompletedClients,
  getOverdueClients, getWaitingApprovalClients, getTotalReceived, getTotalPending,
  getClientsByMethod, getClientsByConsultant, getClientsByRenewal,
  filterClients,
} from '../utils/calculations';

const REPORT_TYPES = [
  { value: 'financeiro', label: 'Financeiro Geral' },
  { value: 'metodo', label: 'Por Método' },
  { value: 'consultor', label: 'Por Coordenador' },
  { value: 'etapas', label: 'Por Etapas' },
  { value: 'renovacoes', label: 'Renovações' },
  { value: 'atrasos', label: 'Atrasos' },
  { value: 'aprovacao', label: 'Em Aprovação' },
  { value: 'cancelados', label: 'Cancelados' },
];

export function Reports() {
  const { clients } = useClients();
  const [reportType, setReportType] = useState('financeiro');
  const [filterConsultant, setFilterConsultant] = useState('Todos');
  const [filterMethod, setFilterMethod] = useState('Todos');
  const [filterMonth, setFilterMonth] = useState('Todos');

  const filtered = useMemo(() => filterClients(clients, {
    consultant: filterConsultant !== 'Todos' ? filterConsultant as any : undefined,
    method: filterMethod !== 'Todos' ? filterMethod as any : undefined,
    entryMonth: filterMonth !== 'Todos' ? filterMonth as any : undefined,
  }), [clients, filterConsultant, filterMethod, filterMonth]);

  const reportData = useMemo(() => {
    switch (reportType) {
      case 'atrasos': return getOverdueClients(filtered);
      case 'aprovacao': return getWaitingApprovalClients(filtered);
      case 'cancelados': return getCanceledClients(filtered);
      default: return filtered;
    }
  }, [reportType, filtered]);

  const summary = useMemo(() => ({
    total: filtered.length,
    active: getActiveClients(filtered).length,
    completed: getCompletedClients(filtered).length,
    canceled: getCanceledClients(filtered).length,
    overdue: getOverdueClients(filtered).length,
    received: getTotalReceived(filtered),
    pending: getTotalPending(filtered),
    willRenew: getClientsByRenewal(filtered, 'SIM').length,
  }), [filtered]);

  return (
    <AppLayout
      title="Relatórios"
      headerActions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<PictureAsPdfIcon />} variant="outlined" size="small" disabled>PDF</Button>
          <Button startIcon={<TableChartIcon />} variant="outlined" size="small" disabled>Excel</Button>
          <Button startIcon={<DownloadIcon />} variant="outlined" size="small" disabled>CSV</Button>
        </Box>
      }
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Exportação disponível em breve. Selecione o tipo de relatório e os filtros desejados.
      </Alert>

      {/* Report type + filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de relatório</InputLabel>
                <Select label="Tipo de relatório" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  {REPORT_TYPES.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Coordenador</InputLabel>
                <Select label="Coordenador" value={filterConsultant} onChange={(e) => setFilterConsultant(e.target.value)}>
                  <MenuItem value="Todos">Todos</MenuItem>
                  {CONSULTANTS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Método</InputLabel>
                <Select label="Método" value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
                  <MenuItem value="Todos">Todos</MenuItem>
                  {METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Mês de entrada</InputLabel>
                <Select label="Mês de entrada" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                  <MenuItem value="Todos">Todos</MenuItem>
                  {ENTRY_MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total', value: summary.total, color: 'text.secondary' },
          { title: 'Ativos', value: summary.active, color: '#1565C0' },
          { title: 'Concluídos', value: summary.completed, color: '#2D9D4E' },
          { title: 'Cancelados', value: summary.canceled, color: '#DC2626' },
          { title: 'Atrasados', value: summary.overdue, color: '#DC2626' },
          { title: 'Já recebido', value: formatCurrency(summary.received), color: '#2D9D4E' },
          { title: 'A receber', value: formatCurrency(summary.pending), color: '#F57C00' },
          { title: 'Vão renovar', value: summary.willRenew, color: '#2D9D4E' },
        ].map((k) => (
          <Grid key={k.title} size={{ xs: 6, sm: 3, md: 3 }}>
            <KPICard title={k.title} value={k.value} color={k.color} />
          </Grid>
        ))}
      </Grid>

      {/* By method breakdown */}
      {reportType === 'metodo' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {['SABOR', 'CLÍNICA 360', 'CLÍNICA 180'].map((method) => {
            const mc = getClientsByMethod(filtered, method);
            return (
              <Grid key={method} size={{ xs: 12, sm: 4 }}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>{method}</Typography>
                    <Typography variant="body2">Clientes: <strong>{mc.length}</strong></Typography>
                    <Typography variant="body2">Recebido: <strong style={{ color: '#2D9D4E' }}>{formatCurrency(getTotalReceived(mc))}</strong></Typography>
                    <Typography variant="body2">A receber: <strong style={{ color: '#F57C00' }}>{formatCurrency(getTotalPending(mc))}</strong></Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* By consultant breakdown */}
      {reportType === 'consultor' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {CONSULTANTS.map((consultant) => {
            const cc = getClientsByConsultant(filtered, consultant);
            return (
              <Grid key={consultant} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.5 }}>{consultant}</Typography>
                    <Typography variant="body2">Clientes: <strong>{cc.length}</strong></Typography>
                    <Typography variant="body2">Recebido: <strong style={{ color: '#2D9D4E' }}>{formatCurrency(getTotalReceived(cc))}</strong></Typography>
                    <Typography variant="body2">A receber: <strong style={{ color: '#F57C00' }}>{formatCurrency(getTotalPending(cc))}</strong></Typography>
                    <Typography variant="body2">Atrasados: <strong style={{ color: '#DC2626' }}>{getOverdueClients(cc).length}</strong></Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Data table */}
      <Card>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {REPORT_TYPES.find((r) => r.value === reportType)?.label}
          </Typography>
          <Chip label={`${reportData.length} registros`} size="small" sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 600 }} />
        </Box>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Mês entrada</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Coordenador</TableCell>
                <TableCell>Status E1</TableCell>
                <TableCell>Status E2</TableCell>
                <TableCell>Status E3</TableCell>
                <TableCell>Status E4</TableCell>
                <TableCell align="right">Recebido</TableCell>
                <TableCell align="right">A receber</TableCell>
                <TableCell>Renova?</TableCell>
                <TableCell>Mês renovação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                  <TableCell>
                    <Typography variant="caption">{c.entryMonth.charAt(0) + c.entryMonth.slice(1).toLowerCase()}</Typography>
                  </TableCell>
                  <TableCell><MethodBadge method={c.method} /></TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{c.consultant || '—'}</Typography>
                  </TableCell>
                  <TableCell><StatusBadge status={c.stages.e1.status} /></TableCell>
                  <TableCell><StatusBadge status={c.stages.e2.status} /></TableCell>
                  <TableCell><StatusBadge status={c.stages.e3.status} /></TableCell>
                  <TableCell><StatusBadge status={c.stages.e4.status} /></TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D9D4E' }}>{formatCurrency(c.receivedAmount)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#F57C00' }}>{formatCurrency(c.pendingAmount)}</Typography>
                  </TableCell>
                  <TableCell><RenewalBadge status={c.willRenew} /></TableCell>
                  <TableCell>
                    <Typography variant="caption">{c.renewalMonth || '—'}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </AppLayout>
  );
}
