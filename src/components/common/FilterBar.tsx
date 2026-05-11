import {
  Box, TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, IconButton, Tooltip, InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { FilterState } from '../../types';
import { CONSULTANTS, METHODS, ENTRY_MONTHS, RENEWAL_MONTHS, STAGE_STATUSES, RENEWAL_STATUSES } from '../../utils/formatters';

type Props = {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
};

export function FilterBar({ filters, onChange, onReset }: Props) {
  const activeCount = [
    filters.consultant !== 'Todos',
    filters.method !== 'Todos',
    filters.entryMonth !== 'Todos',
    filters.renewalMonth !== 'Todos',
    filters.stageStatus !== 'Todos',
    filters.willRenew !== 'Todos',
    filters.overdue,
  ].filter(Boolean).length;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Buscar cliente..."
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} /></InputAdornment>,
            endAdornment: filters.search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onChange({ search: '' })}>
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ minWidth: 220 }}
      />

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Coordenador</InputLabel>
        <Select label="Coordenador" value={filters.consultant} onChange={(e) => onChange({ consultant: e.target.value })}>
          <MenuItem value="Todos">Todos</MenuItem>
          {CONSULTANTS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Método</InputLabel>
        <Select label="Método" value={filters.method} onChange={(e) => onChange({ method: e.target.value })}>
          <MenuItem value="Todos">Todos</MenuItem>
          {METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Mês entrada</InputLabel>
        <Select label="Mês entrada" value={filters.entryMonth} onChange={(e) => onChange({ entryMonth: e.target.value })}>
          <MenuItem value="Todos">Todos</MenuItem>
          {ENTRY_MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Mês renovação</InputLabel>
        <Select label="Mês renovação" value={filters.renewalMonth} onChange={(e) => onChange({ renewalMonth: e.target.value })}>
          <MenuItem value="Todos">Todos</MenuItem>
          {RENEWAL_MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Status etapa</InputLabel>
        <Select label="Status etapa" value={filters.stageStatus} onChange={(e) => onChange({ stageStatus: e.target.value })}>
          <MenuItem value="Todos">Todos</MenuItem>
          {STAGE_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Vai renovar</InputLabel>
        <Select label="Vai renovar" value={filters.willRenew} onChange={(e) => onChange({ willRenew: e.target.value })}>
          <MenuItem value="Todos">Todos</MenuItem>
          {RENEWAL_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </FormControl>

      <Tooltip title="Apenas atrasados">
        <Chip
          label="Atrasados"
          clickable
          color={filters.overdue ? 'error' : 'default'}
          variant={filters.overdue ? 'filled' : 'outlined'}
          onClick={() => onChange({ overdue: !filters.overdue })}
          size="small"
          sx={{ fontWeight: 600, height: 32 }}
        />
      </Tooltip>

      {activeCount > 0 && (
        <Chip
          label={`Limpar filtros (${activeCount})`}
          clickable
          onDelete={onReset}
          size="small"
          sx={(theme) => ({
            fontWeight: 600, height: 32,
            bgcolor: alpha('#DC2626', 0.10),
            color: '#DC2626',
            border: `1px solid ${alpha('#DC2626', 0.25)}`,
          })}
          deleteIcon={<ClearIcon sx={{ fontSize: 14, color: '#DC2626 !important' }} />}
          onClick={onReset}
        />
      )}
    </Box>
  );
}
