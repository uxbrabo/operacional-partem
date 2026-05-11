import { Box, CircularProgress, Typography } from '@mui/material';

type Props = { message?: string };

export function LoadingState({ message = 'Carregando...' }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
      <CircularProgress color="primary" size={40} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}
