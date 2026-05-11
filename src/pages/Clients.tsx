import { useState, useMemo } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Typography, InputAdornment, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/common/StatusBadge';
import { MethodBadge } from '../components/common/MethodBadge';
import { ClientForm, clientToForm, EMPTY_CLIENT_FORM, METHODS } from '../components/clients/ClientForm';
import type { ClientFormState } from '../components/clients/ClientForm';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/formatters';
import type { Client } from '../types';

const CONSULTANTS = ['Todos', 'LUCAS', 'RODRIGO'];

export function Clients() {
  const { clients, professionals, addClient, updateClient, deleteClient } = useData();

  const socialMediaPros = professionals.filter((p) => p.type === 'social-media' && p.active).map((p) => p.name);
  const designerPros = professionals.filter((p) => p.type === 'designer' && p.active).map((p) => p.name);
  const socialMediaOptions = ['Todos', ...socialMediaPros];
  const designerOptions = ['Todos', ...designerPros];

  // Filters
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('Todos');
  const [consultantFilter, setConsultantFilter] = useState('Todos');
  const [smFilter, setSmFilter] = useState('Todos');
  const [designerFilter, setDesignerFilter] = useState('Todos');

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormState>(EMPTY_CLIENT_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const hasFilters = methodFilter !== 'Todos' || consultantFilter !== 'Todos' || smFilter !== 'Todos' || designerFilter !== 'Todos' || search;

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (methodFilter !== 'Todos' && c.method !== methodFilter) return false;
      if (consultantFilter !== 'Todos' && c.consultant !== consultantFilter) return false;
      if (smFilter !== 'Todos' && (c.socialMedia ?? '') !== smFilter) return false;
      if (designerFilter !== 'Todos' && (c.designer ?? '') !== designerFilter) return false;
      return true;
    });
  }, [clients, search, methodFilter, consultantFilter, smFilter, designerFilter]);

  function clearFilters() {
    setSearch(''); setMethodFilter('Todos'); setConsultantFilter('Todos');
    setSmFilter('Todos'); setDesignerFilter('Todos');
  }

  function openAdd() {
    setForm(EMPTY_CLIENT_FORM);
    setEditId(null); setErrors([]);
    setOpen(true);
  }

  function openEdit(c: Client) {
    setForm(clientToForm(c));
    setEditId(c.id); setErrors([]);
    setOpen(true);
  }

  function validate(form: ClientFormState): string[] {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Nome é obrigatório');
    if (!form.method) errs.push('Método é obrigatório');
    if (!form.entryMonth) errs.push('Mês de entrada é obrigatório');
    return errs;
  }

  function handleSave(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    const errs = validate(form);
    if (errs.length) { setErrors(errs); return; }
    if (editId) updateClient(editId, data);
    else addClient(data);
    setOpen(false);
  }

  return (
    <AppLayout title="Clientes" subtitle={`${filtered.length} de ${clients.length} clientes`}>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small" placeholder="Buscar cliente..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200, maxWidth: 320 }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> } }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Método</InputLabel>
          <Select label="Método" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <MenuItem value="Todos">Todos</MenuItem>
            {METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Coordenador</InputLabel>
          <Select label="Coordenador" value={consultantFilter} onChange={(e) => setConsultantFilter(e.target.value)}>
            {CONSULTANTS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Social Media</InputLabel>
          <Select label="Social Media" value={smFilter} onChange={(e) => setSmFilter(e.target.value)}>
            {socialMediaOptions.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Designer</InputLabel>
          <Select label="Designer" value={designerFilter} onChange={(e) => setDesignerFilter(e.target.value)}>
            {designerOptions.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </FormControl>
        {hasFilters && (
          <Button size="small" startIcon={<FilterListIcon />} onClick={clearFilters} sx={{ color: 'text.secondary' }}>
            Limpar
          </Button>
        )}
        <Box sx={{ ml: 'auto' }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            Novo cliente
          </Button>
        </Box>
      </Box>

      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Coordenador</TableCell>
                <TableCell>Social Media</TableCell>
                <TableCell>Designer</TableCell>
                <TableCell>Entrada</TableCell>
                <TableCell>E1</TableCell>
                <TableCell>E2</TableCell>
                <TableCell>E3</TableCell>
                <TableCell>E4</TableCell>
                <TableCell>Renovação</TableCell>
                <TableCell align="right">Recebido</TableCell>
                <TableCell align="right">Pendente</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                      {(c.phone || c.email) && (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {c.phone}{c.phone && c.email ? ' · ' : ''}{c.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell><MethodBadge method={c.method} /></TableCell>
                  <TableCell><Typography variant="body2">{c.consultant || '—'}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{c.socialMedia || '—'}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{c.designer || '—'}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{c.entryMonth}</Typography></TableCell>
                  <TableCell><StatusBadge status={c.stages.e1.status} size="small" /></TableCell>
                  <TableCell><StatusBadge status={c.stages.e2.status} size="small" /></TableCell>
                  <TableCell><StatusBadge status={c.stages.e3.status} size="small" /></TableCell>
                  <TableCell><StatusBadge status={c.stages.e4.status} size="small" /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{c.renewalMonth || '—'}</Typography></TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>{formatCurrency(c.receivedAmount)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>{formatCurrency(c.pendingAmount)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: 'primary.main' }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ color: 'error.main' }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={14} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                    Nenhum cliente encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ClientForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        form={form}
        setForm={setForm}
        title={editId ? 'Editar cliente' : 'Novo cliente'}
        errors={errors}
        socialMediaOptions={socialMediaPros}
        designerOptions={designerPros}
      />

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir cliente</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir <strong>{clients.find((c) => c.id === deleteId)?.name}</strong>? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">Cancelar</Button>
          <Button onClick={() => { if (deleteId) { deleteClient(deleteId); setDeleteId(null); } }} variant="contained" color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
