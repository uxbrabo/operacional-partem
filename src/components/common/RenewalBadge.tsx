import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { RenewalStatus } from '../../types';

const CONFIG: Record<string, { color: string }> = {
  'SIM':   { color: '#2D9D4E' },
  'NÃO':   { color: '#DC2626' },
  'TALVEZ':{ color: '#F57C00' },
  '':      { color: '#6B7280' },
};

type Props = { status: RenewalStatus; size?: 'small' | 'medium' };

export function RenewalBadge({ status, size = 'small' }: Props) {
  const cfg = CONFIG[status] ?? CONFIG[''];
  if (!status) {
    return (
      <Chip
        label="—"
        size={size}
        sx={{ bgcolor: alpha('#6B7280', 0.10), color: 'text.disabled', height: 22 }}
      />
    );
  }
  return (
    <Chip
      label={status}
      size={size}
      sx={{
        bgcolor: alpha(cfg.color, 0.12),
        color: cfg.color,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        height: size === 'small' ? 22 : 28,
      }}
    />
  );
}
