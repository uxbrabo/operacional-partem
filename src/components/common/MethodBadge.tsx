import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Method } from '../../types';

const METHOD_CONFIG: Record<Method, { color: string }> = {
  'SABOR':      { color: '#D97706' },
  'CLÍNICA 360':{ color: '#1565C0' },
  'CLÍNICA 180':{ color: '#7B1FA2' },
};

type Props = { method: Method; size?: 'small' | 'medium' };

export function MethodBadge({ method, size = 'small' }: Props) {
  const cfg = METHOD_CONFIG[method] ?? { color: '#6B7280' };
  return (
    <Chip
      label={method}
      size={size}
      sx={{
        bgcolor: alpha(cfg.color, 0.12),
        color: cfg.color,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.68rem' : '0.78rem',
        height: size === 'small' ? 22 : 28,
        border: `1px solid ${alpha(cfg.color, 0.22)}`,
      }}
    />
  );
}
