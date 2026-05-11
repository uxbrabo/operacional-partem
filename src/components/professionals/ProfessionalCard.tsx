import {
  Card, CardContent, Box, Typography, Avatar, Chip,
  LinearProgress, Divider, Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PendingIcon from '@mui/icons-material/Pending';
import { formatCurrency } from '../../utils/formatters';
import type { ProfessionalType } from '../../types';

type Stats = {
  name: string;
  total: number;
  active: number;
  overdue: number;
  waitingApproval: number;
  received: number;
  pending: number;
  willRenew: number;
};

const TYPE_COLORS: Record<ProfessionalType, string> = {
  consultor:      '#1565C0',
  'social-media': '#0288D1',
  designer:       '#7B1FA2',
  filmmaker:      '#C62828',
};

const TYPE_LABELS: Record<ProfessionalType, string> = {
  consultor:      'Coordenador',
  'social-media': 'Social Mídia',
  designer:       'Designer',
  filmmaker:      'Gestor de Tráfego',
};

type Props = {
  stats: Stats;
  clients: string[];
  type: ProfessionalType;
  role: string;
  onView: () => void;
};

export function ProfessionalCard({ stats, clients, type, role, onView }: Props) {
  const color = TYPE_COLORS[type] ?? '#2D9D4E';
  const typeLabel = TYPE_LABELS[type] ?? role;
  const progressPct = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 44, height: 44, fontWeight: 700, fontSize: '1.1rem' }}>
            {stats.name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }} noWrap>
              {stats.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
              <Chip
                label={typeLabel}
                size="small"
                sx={{
                  height: 18, fontSize: '0.65rem', fontWeight: 700,
                  bgcolor: alpha(color, 0.12), color, px: 0.25,
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {stats.total} clientes
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Financial metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
          <Box sx={{ bgcolor: alpha('#2D9D4E', 0.12), borderRadius: 2, p: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#2D9D4E', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              Recebido
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D9D4E', fontSize: '0.95rem' }}>
              {formatCurrency(stats.received)}
            </Typography>
          </Box>
          <Box sx={{ bgcolor: alpha('#F57C00', 0.12), borderRadius: 2, p: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#F57C00', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              A receber
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, color: '#F57C00', fontSize: '0.95rem' }}>
              {formatCurrency(stats.pending)}
            </Typography>
          </Box>
        </Box>

        {/* Status chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
            label={`${stats.overdue} atrasados`}
            size="small"
            sx={{
              bgcolor: stats.overdue > 0 ? alpha('#DC2626', 0.12) : alpha('#6B7280', 0.08),
              color: stats.overdue > 0 ? '#DC2626' : 'text.secondary',
              fontWeight: 600, fontSize: '0.7rem',
            }}
          />
          <Chip
            icon={<PendingIcon sx={{ fontSize: '14px !important' }} />}
            label={`${stats.waitingApproval} em aprovação`}
            size="small"
            sx={{
              bgcolor: stats.waitingApproval > 0 ? alpha('#F57C00', 0.12) : alpha('#6B7280', 0.08),
              color: stats.waitingApproval > 0 ? '#F57C00' : 'text.secondary',
              fontWeight: 600, fontSize: '0.7rem',
            }}
          />
          <Chip
            label={`${stats.willRenew} renova`}
            size="small"
            sx={{ bgcolor: alpha('#2D9D4E', 0.12), color: '#2D9D4E', fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>

        {/* Progress bar */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Ativos / Total</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.7rem' }}>
              {stats.active}/{stats.total}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progressPct} color="primary" />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Client list preview */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          Clientes
        </Typography>
        <Box sx={{ mt: 0.75 }}>
          {clients.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>Nenhum cliente atribuído</Typography>
          ) : (
            <>
              {clients.slice(0, 4).map((name, i) => (
                <Typography key={i} variant="caption" sx={{ display: 'block', color: 'text.primary', py: 0.25 }}>
                  • {name}
                </Typography>
              ))}
              {clients.length > 4 && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  +{clients.length - 4} mais...
                </Typography>
              )}
            </>
          )}
        </Box>
      </CardContent>

      <Box sx={{ px: 2.5, pb: 2 }}>
        <Button
          fullWidth variant="outlined" size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={onView}
          sx={{ fontWeight: 600, borderColor: alpha(color, 0.4), color, '&:hover': { borderColor: color, bgcolor: alpha(color, 0.08) } }}
        >
          Ver carteira completa
        </Button>
      </Box>
    </Card>
  );
}
