import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  positive?: boolean;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ title, description, icon, positive, action }: Props) {
  return (
    <Box
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', py: 6, px: 3, textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 2, color: positive ? 'primary.main' : 'text.disabled', fontSize: 56 }}>
        {icon ?? (positive ? <TaskAltIcon fontSize="inherit" /> : <InboxIcon fontSize="inherit" />)}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 320 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button variant="outlined" sx={{ mt: 2 }} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
