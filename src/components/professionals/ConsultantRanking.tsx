import { Box, Typography, Avatar, LinearProgress } from '@mui/material';
import { formatCurrency } from '../../utils/formatters';

type Item = { name: string; received: number };

const COLORS: Record<string, string> = {
  'Lucas':   '#1565C0',
  'Rodrigo': '#2D9D4E',
};

type Props = { data: Item[] };

export function ConsultantRanking({ data }: Props) {
  const max = Math.max(...data.map((d) => d.received), 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.map((item) => {
        const pct = (item.received / max) * 100;
        const color = COLORS[item.name] ?? '#2D9D4E';
        return (
          <Box key={item.name}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: color, fontSize: '0.75rem', fontWeight: 700 }}>
                {item.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: color }}>
                    {formatCurrency(item.received)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{ '& .MuiLinearProgress-bar': { bgcolor: color } }}
                />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
