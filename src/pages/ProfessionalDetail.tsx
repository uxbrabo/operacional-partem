import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Avatar, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, LinearProgress, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { AppLayout } from '../components/layout/AppLayout';
import { KPICard } from '../components/common/KPICard';
import { StatusBadge } from '../components/common/StatusBadge';
import { MethodBadge } from '../components/common/MethodBadge';
import { RenewalBadge } from '../components/common/RenewalBadge';
import { EmptyState } from '../components/common/EmptyState';
import { ClientForm, clientToForm, EMPTY_CLIENT_FORM } from '../components/clients/ClientForm';
import type { ClientFormState } from '../components/clients/ClientForm';
import { useData } from '../contexts/DataContext';
import { getConsultantStats, isClientOverdue } from '../utils/calculations';
import { formatCurrency, formatDays } from '../utils/formatters';
import type { Client, ProfessionalType } from '../types';

const TYPE_COLORS: Record<ProfessionalType, string> = {
  consultor: '#1565C0',
  'social-media': '#0288D1',
  designer: '#7B1FA2',
  filmmaker: '#C62828',
};

export function ProfessionalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, professionals, addClient, updateClient, deleteClient, updateProfessional, getClientsForProfessional } = useData();

  // Client form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormState>(EMPTY_CLIENT_FORM);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<'remove' | 'delete'>('remove');

  const prof = professionals.find((p) => p.id === id);

  const profClients = useMemo(
    () => (prof ? getClientsForProfessional(prof) : []),
    [prof, getClientsForProfessional],
  );

  const stats = useMemo(
    () => getConsultantStats(clients, prof?.name ?? ''),
    [clients, prof],
  );

  const methodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    profClients.forEach((c) => { counts[c.method] = (counts[c.method] ?? 0) + 1; });
    return counts;
  }, [profClients]);

  const socialMediaOptions = professionals.filter((p) => p.type === 'social-media' && p.active).map((p) => p.name);
  const designerOptions = professionals.filter((p) => p.type === 'designer' && p.active).map((p) => p.name);

  if (!prof) {
    return (
      <AppLayout title="Profissional">
        <EmptyState title="Profissional não encontrado" action={{ label: 'Voltar', onClick: () => navigate('/carteiras') }} />
      </AppLayout>
    );
  }

  const color = TYPE_COLORS[prof.type] ?? '#64748B';

  function buildDefaultForm(): ClientFormState {
    const base = { ...EMPTY_CLIENT_FORM };
    if (prof!.type === 'consultor') base.consultant = prof!.name.toUpperCase() as any;
    if (prof!.type === 'social-media') base.socialMedia = prof!.name;
    if (prof!.type === 'designer') base.designer = prof!.name;
    return base;
  }

  function openAdd() {
    setForm(buildDefaultForm());
    setEditClientId(null);
    setFormErrors([]);
    setFormOpen(true);
  }

  function openEdit(c: Client) {
    setForm(clientToForm(c));
    setEditClientId(c.id);
    setFormErrors([]);
    setFormOpen(true);
  }

  function handleFormSave(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Nome é obrigatório');
    if (!form.method) errs.push('Método é obrigatório');
    if (!form.entryMonth) errs.push('Mês de entrada é obrigatório');
    if (errs.length) { setFormErrors(errs); return; }

    if (editClientId) {
      updateClient(editClientId, data);
    } else {
      const newClient = addClient(data);
      if (prof!.type === 'filmmaker') {
        updateProfessional(prof!.id, {
          portfolioClientIds: [...prof!.portfolioClientIds, newClient.id],
        });
      }
    }
    setFormOpen(false);
  }

  function openRemove(c: Client) {
    setDeleteId(c.id);
    setDeleteMode('remove');
  }

  function openDelete(c: Client) {
    setDeleteId(c.id);
    setDeleteMode('delete');
  }

  function handleConfirmAction() {
    if (!deleteId) return;
    if (deleteMode === 'delete') {
      deleteClient(deleteId);
    } else {
      if (prof!.type === 'consultor') updateClient(deleteId, { consultant: '' });
      if (prof!.type === 'social-media') updateClient(deleteId, { socialMedia: undefined });
      if (prof!.type === 'designer') updateClient(deleteId, { designer: undefined });
      if (prof!.type === 'filmmaker') {
        updateProfessional(prof!.id, {
          portfolioClientIds: prof!.portfolioClientIds.filter((cid) => cid !== deleteId),
        });
      }
    }
    setDeleteId(null);
  }

  const deletingClient = clients.find((c) => c.id === deleteId);

  return (
    <AppLayout
      title={prof.name}
      headerActions={
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/carteiras')} variant="outlined" size="small">
          Voltar
        </Button>
      }
    >
      {/* Profile header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: color, fontSize: '1.5rem', fontWeight: 800 }}>
              {prof.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{prof.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{prof.role}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={prof.active ? 'Ativo' : 'Inativo'}
                  size="small"
                  color={prof.active ? 'success' : 'default'}
                  sx={{ fontWeight: 700 }}
                />
                {Object.entries(methodCounts).map(([method, count]) => (
                  <Chip key={method} label={`${method}: ${count}`} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total de clientes', value: profClients.length, color },
          { title: 'Atrasados', value: stats.overdue, color: '#DC2626' },
          { title: 'Em aprovação', value: stats.waitingApproval, color: '#F57C00' },
          { title: 'Já recebido', value: formatCurrency(stats.received), color: '#2D9D4E' },
          { title: 'A receber', value: formatCurrency(stats.pending), color: '#F57C00' },
          { title: 'Vão renovar', value: stats.willRenew, color: '#2D9D4E' },
          { title: 'Não renovam', value: stats.wontRenew, color: '#DC2626' },
          { title: 'Concluídos', value: profClients.filter((c) => c.completedStages === 4).length, color: '#2D9D4E' },
        ].map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 6, sm: 3 }}>
            <KPICard title={kpi.title} value={kpi.value} color={kpi.color} />
          </Grid>
        ))}
      </Grid>

      {/* Clients table */}
      <Card>
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', flex: 1 }}>
            Clientes da carteira
          </Typography>
          <Chip label={profClients.length} size="small" sx={{ bgcolor: 'action.hover', color: 'text.secondary', fontWeight: 700 }} />
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openAdd}>
            Adicionar cliente
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>E1</TableCell>
                <TableCell>E2</TableCell>
                <TableCell>E3</TableCell>
                <TableCell>E4</TableCell>
                <TableCell align="center">Progresso</TableCell>
                <TableCell align="right">Recebido</TableCell>
                <TableCell align="right">A receber</TableCell>
                <TableCell>Renovação</TableCell>
                <TableCell align="center">Renova?</TableCell>
                <TableCell align="center">Dias</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    Nenhum cliente nesta carteira. Clique em "Adicionar cliente" para começar.
                  </TableCell>
                </TableRow>
              ) : profClients.map((c: Client) => {
                const overdue = isClientOverdue(c);
                return (
                  <TableRow
                    key={c.id}
                    sx={{ bgcolor: overdue ? 'rgba(220,38,38,0.03)' : 'transparent' }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: overdue ? '#DC2626' : 'text.primary' }}>
                        {c.name}
                      </Typography>
                    </TableCell>
                    <TableCell><MethodBadge method={c.method} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e1.status} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e2.status} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e3.status} /></TableCell>
                    <TableCell><StatusBadge status={c.stages.e4.status} /></TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.completedStages}/4</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(c.completedStages / 4) * 100}
                          sx={{ width: 40 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D9D4E' }}>{formatCurrency(c.receivedAmount)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#F57C00' }}>{formatCurrency(c.pendingAmount)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.renewalMonth || '—'}</Typography>
                    </TableCell>
                    <TableCell align="center"><RenewalBadge status={c.willRenew} /></TableCell>
                    <TableCell align="center">
                      <Chip
                        label={formatDays(c.daysToDelivery)}
                        size="small"
                        sx={{
                          height: 20,
                          bgcolor: overdue ? 'rgba(220,38,38,0.10)' : 'action.hover',
                          color: overdue ? '#DC2626' : 'text.secondary',
                          fontWeight: 700, fontSize: '0.65rem',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="Editar cliente">
                        <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: 'primary.main' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remover da carteira">
                        <IconButton size="small" onClick={() => openRemove(c)} sx={{ color: 'warning.main' }}>
                          <PersonRemoveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir cliente">
                        <IconButton size="small" onClick={() => openDelete(c)} sx={{ color: 'error.main' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Client add/edit form */}
      <ClientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
        form={form}
        setForm={setForm}
        title={editClientId ? 'Editar cliente' : `Novo cliente — ${prof.name}`}
        errors={formErrors}
        socialMediaOptions={socialMediaOptions}
        designerOptions={designerOptions}
      />

      {/* Remove / Delete confirm dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {deleteMode === 'remove' ? 'Remover da carteira' : 'Excluir cliente'}
        </DialogTitle>
        <DialogContent>
          {deleteMode === 'remove' ? (
            <Typography>
              Remover <strong>{deletingClient?.name}</strong> da carteira de <strong>{prof.name}</strong>?
              O cliente <em>não</em> será excluído do sistema.
            </Typography>
          ) : (
            <Typography>
              Excluir permanentemente <strong>{deletingClient?.name}</strong>? Esta ação não pode ser desfeita.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">Cancelar</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={deleteMode === 'delete' ? 'error' : 'warning'}
          >
            {deleteMode === 'remove' ? 'Remover da carteira' : 'Excluir cliente'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
