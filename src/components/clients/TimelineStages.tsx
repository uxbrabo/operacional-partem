import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import type { ClientStages, StageStatus } from '../../types';

const STAGE_LABELS = ['E1 — Entrega 1', 'E2 — Entrega 2', 'E3 — Entrega 3', 'E4 — Entrega 4'];

function StageIcon({ status }: { status: StageStatus }) {
  if (status === 'Concluído')    return <CheckCircleIcon sx={{ color: '#2D9D4E' }} />;
  if (status === 'Cancelado')    return <CancelIcon sx={{ color: '#DC2626' }} />;
  if (status === 'Em aprovação') return <PendingIcon sx={{ color: '#F57C00' }} />;
  if (status === 'Em execução')  return <HourglassEmptyIcon sx={{ color: '#1565C0' }} />;
  return <RadioButtonUncheckedIcon sx={{ color: 'text.disabled' }} />;
}

const STATUS_COLOR: Record<StageStatus, string> = {
  'Concluído':    '#2D9D4E',
  'Cancelado':    '#DC2626',
  'Em aprovação': '#F57C00',
  'Em execução':  '#1565C0',
  'Não iniciada': '#6B7280',
};

type Props = { stages: ClientStages };

export function TimelineStages({ stages }: Props) {
  const stageList = [stages.e1, stages.e2, stages.e3, stages.e4];

  return (
    <Box>
      {stageList.map((stage, idx) => (
        <Box key={idx} sx={{ display: 'flex', gap: 2, mb: idx < 3 ? 1.5 : 0, alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.25 }}>
            <StageIcon status={stage.status} />
            {idx < 3 && (
              <Box
                sx={(theme) => ({
                  width: 2, flex: 1, minHeight: 24, mt: 0.5,
                  bgcolor: stage.status === 'Concluído' ? '#2D9D4E' : theme.palette.divider,
                })}
              />
            )}
          </Box>
          <Box sx={{ flex: 1, pb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: STATUS_COLOR[stage.status] }}>
                {STAGE_LABELS[idx]}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {stage.status}
              </Typography>
            </Box>
            {stage.date && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Data: {stage.date}
              </Typography>
            )}
            {stage.receivedDate && (
              <Typography variant="caption" sx={{ color: '#2D9D4E', display: 'block' }}>
                Recebido em: {stage.receivedDate}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
