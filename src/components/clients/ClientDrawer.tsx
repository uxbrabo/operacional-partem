import {
  Drawer, Box, Typography, IconButton, Divider,
  LinearProgress, Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import NotesIcon from '@mui/icons-material/Notes';
import type { Client } from '../../types';
import { MethodBadge } from '../common/MethodBadge';
import { RenewalBadge } from '../common/RenewalBadge';
import { TimelineStages } from './TimelineStages';
import { formatCurrency, formatDays } from '../../utils/formatters';
import { isClientOverdue } from '../../utils/calculations';

type Props = { client: Client | null; open: boolean; onClose: () => void };

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
      <Box sx={{ color: 'text.disabled', mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </Typography>
        <Box sx={{ mt: 0.25 }}>{typeof value === 'string' ? (
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{value}</Typography>
        ) : value}</Box>
      </Box>
    </Box>
  );
}

export function ClientDrawer({ client, open, onClose }: Props) {
  if (!client) return null;

  const progress = (client.completedStages / 4) * 100;
  const overdue = isClientOverdue(client);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 480 }, p: 0, bgcolor: 'background.default' },
        },
      }}
    >
      {/* Header gradient — brand colors, ok in both modes */}
      <Box
        sx={{
          px: 3, py: 2.5,
          background: 'linear-gradient(135deg, #1A6B33 0%, #2D9D4E 100%)',
          color: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#fff' }}>
              {client.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <MethodBadge method={client.method} />
              {overdue && (
                <Chip label="Atrasado" size="small" sx={{ bgcolor: '#DC2626', color: '#fff', fontWeight: 700, height: 22 }} />
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#fff', mt: -0.5 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Progresso — {client.completedStages} de 4 etapas
            </Typography>
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': { bgcolor: '#fff' },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 3, overflowY: 'auto' }}>
        {/* Financial */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box sx={(theme) => ({ bgcolor: alpha('#2D9D4E', theme.palette.mode === 'dark' ? 0.18 : 0.12), borderRadius: 2, p: 2 })}>
            <Typography variant="caption" sx={{ color: '#2D9D4E', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Já recebido
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D9D4E' }}>
              {formatCurrency(client.receivedAmount)}
            </Typography>
          </Box>
          <Box sx={(theme) => ({ bgcolor: alpha('#F57C00', theme.palette.mode === 'dark' ? 0.18 : 0.12), borderRadius: 2, p: 2 })}>
            <Typography variant="caption" sx={{ color: '#F57C00', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem' }}>
              A receber
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F57C00' }}>
              {formatCurrency(client.pendingAmount)}
            </Typography>
          </Box>
        </Box>

        {/* Info */}
        <InfoRow
          icon={<PersonIcon fontSize="small" />}
          label="Coordenador"
          value={client.consultant || '—'}
        />
        <InfoRow
          icon={<CalendarMonthIcon fontSize="small" />}
          label="Mês de entrada"
          value={client.entryMonth}
        />
        <InfoRow
          icon={<AutorenewIcon fontSize="small" />}
          label="Renovação"
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{client.renewalMonth || '—'}</Typography>
              <RenewalBadge status={client.willRenew} />
            </Box>
          }
        />
        <InfoRow
          icon={<CalendarMonthIcon fontSize="small" />}
          label="Dias para entrega"
          value={
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: overdue ? '#DC2626' : client.daysToDelivery <= 7 ? '#F57C00' : '#2D9D4E' }}
            >
              {formatDays(client.daysToDelivery)}
            </Typography>
          }
        />
        {client.notes && (
          <InfoRow
            icon={<NotesIcon fontSize="small" />}
            label="Observações"
            value={client.notes}
          />
        )}

        <Divider sx={{ my: 2 }} />

        {/* Stages timeline */}
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Linha do tempo das etapas
        </Typography>
        <TimelineStages stages={client.stages} />
      </Box>
    </Drawer>
  );
}
