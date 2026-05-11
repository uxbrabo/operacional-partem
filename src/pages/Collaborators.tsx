import { useState, useMemo } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Typography, Chip, Tabs, Tab, Avatar, Switch,
  FormControlLabel, Paper, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppLayout } from '../components/layout/AppLayout';
import { useData } from '../contexts/DataContext';
import type { Professional, ProfessionalType } from '../types';

const TYPE_LABELS: Record<ProfessionalType, string> = {
  'consultor': 'Coordenador',
  'social-media': 'Social Mídia',
  'designer': 'Designer',
  'filmmaker': 'Gestor de Tráfego',
};

const TYPE_COLORS: Record<ProfessionalType, string> = {
  'consultor': '#1565C0',
  'social-media': '#0288D1',
  'designer': '#7B1FA2',
  'filmmaker': '#C62828',
};

const ROLE_DEFAULTS: Record<ProfessionalType, string> = {
  'consultor': 'Coordenador',
  'social-media': 'Social Mídia',
  'designer': 'Designer',
  'filmmaker': 'Gestor de Tráfego',
};

type TabKey = 'todos' | ProfessionalType;

type FormState = { name: string; role: string; type: ProfessionalType | ''; active: boolean };
const EMPTY_FORM: FormState = { name: '', role: '', type: '', active: true };

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export function Collaborators() {
  const { professionals, addProfessional, updateProfessional, deleteProfessional, getClientsForProfessional } = useData();
  const [tab, setTab] = useState<TabKey>('todos');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    if (tab === 'todos') return professionals;
    return professionals.filter((p) => p.type === tab);
  }, [professionals, tab]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setErrors([]);
    setOpen(true);
  }

  function openEdit(p: Professional) {
    setForm({ name: p.name, role: p.role, type: p.type, active: p.active });
    setEditId(p.id);
    setErrors([]);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setErrors([]);
  }

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'type' && value && !form.role) {
      setForm((prev) => ({ ...prev, [field]: value, role: ROLE_DEFAULTS[value as ProfessionalType] }));
    }
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Nome é obrigatório');
    if (!form.type) errs.push('Tipo é obrigatório');
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const data = {
      name: form.name.trim(),
      role: form.role || ROLE_DEFAULTS[form.type as ProfessionalType],
      type: form.type as ProfessionalType,
      active: form.active,
      portfolioClientIds: [],
    };
    if (editId) {
      updateProfessional(editId, data);
    } else {
      addProfessional(data);
    }
    setOpen(false);
  }

  function handleDelete() {
    if (deleteId) {
      deleteProfessional(deleteId);
      setDeleteId(null);
    }
  }

  const counts = useMemo(() => {
    const result: Record<string, number> = { todos: professionals.length };
    professionals.forEach((p) => {
      result[p.type] = (result[p.type] ?? 0) + 1;
    });
    return result;
  }, [professionals]);

  return (
    <AppLayout title="Colaboradores" subtitle={`${professionals.length} colaboradores cadastrados`}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ '& .MuiTab-root': { minWidth: 'auto', px: 2 } }}
        >
          <Tab label={`Todos (${counts.todos ?? 0})`} value="todos" />
          <Tab label={`Coordenadores (${counts.consultor ?? 0})`} value="consultor" />
          <Tab label={`Designers (${counts.designer ?? 0})`} value="designer" />
          <Tab label={`Social Mídia (${counts['social-media'] ?? 0})`} value="social-media" />
          <Tab label={`Gestores de Tráfego (${counts.filmmaker ?? 0})`} value="filmmaker" />
        </Tabs>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Novo colaborador
        </Button>
      </Box>

      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Colaborador</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell align="center">Clientes</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((p) => {
                const profClients = getClientsForProfessional(p);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36, height: 36,
                            bgcolor: TYPE_COLORS[p.type],
                            fontSize: '0.8rem', fontWeight: 700,
                          }}
                        >
                          {getInitials(p.name)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={TYPE_LABELS[p.type]}
                        size="small"
                        sx={{
                          bgcolor: `${TYPE_COLORS[p.type]}18`,
                          color: TYPE_COLORS[p.type],
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{p.role}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={profClients.length} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={p.active ? 'Ativo' : 'Inativo'}
                        size="small"
                        color={p.active ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: 'primary.main' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteId(p.id)} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    Nenhum colaborador encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editId ? 'Editar colaborador' : 'Novo colaborador'}
        </DialogTitle>
        <DialogContent dividers>
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>{errors.join(' · ')}</Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth size="small" label="Nome *"
                value={form.name} onChange={(e) => set('name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo *</InputLabel>
                <Select
                  label="Tipo *"
                  value={form.type}
                  onChange={(e) => set('type', e.target.value as ProfessionalType)}
                >
                  <MenuItem value="consultor">Coordenador</MenuItem>
                  <MenuItem value="designer">Designer</MenuItem>
                  <MenuItem value="social-media">Social Mídia</MenuItem>
                  <MenuItem value="filmmaker">Gestor de Tráfego</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth size="small" label="Cargo"
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder={form.type ? ROLE_DEFAULTS[form.type as ProfessionalType] : ''}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.active}
                    onChange={(e) => set('active', e.target.checked)}
                    color="success"
                  />
                }
                label="Colaborador ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            {editId ? 'Salvar alterações' : 'Criar colaborador'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir colaborador</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir{' '}
            <strong>{professionals.find((p) => p.id === deleteId)?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
