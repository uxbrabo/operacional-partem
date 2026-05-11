import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { StageStatus } from '../../types';

const STATUS_CONFIG: Record<StageStatus, { label: string; color: string }> = {
  'Não iniciada': { label: 'Não iniciada', color: '#6B7280' },
  'Em execução':  { label: 'Em execução',  color: '#1565C0' },
  'Em aprovação': { label: 'Em aprovação', color: '#F57C00' },
  'Concluído':    { label: 'Concluído',    color: '#2D9D4E' },
  'Cancelado':    { label: 'Cancelado',    color: '#DC2626' },
};

type Props = { status: StageStatus; size?: 'small' | 'medium' };

export function StatusBadge({ status, size = 'small' }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Não iniciada'];
  return (
    <Chip
      label={cfg.label}
      size={size}
      sx={{
        bgcolor: alpha(cfg.color, 0.12),
        color: cfg.color,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        height: size === 'small' ? 22 : 28,
        border: `1px solid ${alpha(cfg.color, 0.25)}`,
      }}
    />
  );
}
