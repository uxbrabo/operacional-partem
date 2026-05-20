import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactsIcon from '@mui/icons-material/Contacts';
import BadgeIcon from '@mui/icons-material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { useAuth } from '../../contexts/AuthContext';

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Início', icon: <HomeIcon />, path: '/' },
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Clientes', icon: <ContactsIcon />, path: '/clientes' },
  { label: 'Acompanhamento', icon: <PeopleIcon />, path: '/acompanhamento' },
  { label: 'Carteiras', icon: <AccountTreeIcon />, path: '/carteiras' },
  { label: 'Colaboradores', icon: <BadgeIcon />, path: '/colaboradores' },
  { label: 'Calendário', icon: <CalendarMonthIcon />, path: '/calendario' },
  { label: 'Planejamento', icon: <CalendarViewMonthIcon />, path: '/planejamento' },
  { label: 'Gamificação', icon: <EmojiEventsIcon />, path: '/gamificacao' },
  { label: 'Variáveis', icon: <AttachMoneyIcon />, path: '/variaveis' },
  { label: 'Relatórios', icon: <AssessmentIcon />, path: '/relatorios' },
];

const BOTTOM_ITEMS = [
  { label: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
];

type Props = { open: boolean; onClose: () => void; variant: 'permanent' | 'temporary' };

export function Sidebar({ open, onClose, variant }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  function handleNav(path: string) {
    navigate(path);
    if (variant === 'temporary') onClose();
  }

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box
          component="img"
          src={isDark ? '/Logo-branca.svg' : '/Logo-preta.svg'}
          alt="Partem"
          sx={{ height: 32, width: 'auto', objectFit: 'contain' }}
        />
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Nav */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => handleNav(item.path)}
            sx={{ py: 1, px: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: isActive(item.path) ? 'primary.main' : 'text.disabled' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    color: isActive(item.path) ? 'primary.dark' : 'text.primary',
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Bottom */}
      <List sx={{ px: 1.5 }}>
        {BOTTOM_ITEMS.map((item) => (
          <ListItemButton
            key={item.path}
            selected={isActive(item.path)}
            onClick={() => handleNav(item.path)}
            sx={{ py: 1, px: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: isActive(item.path) ? 'primary.main' : 'text.disabled' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' } } }}
            />
          </ListItemButton>
        ))}

        <ListItemButton onClick={logout} sx={{ py: 1, px: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sair"
            slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500, color: 'error.main' } } }}
          />
        </ListItemButton>
      </List>

      {/* User */}
      <Box sx={{ px: 2, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
          {user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'A'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }} noWrap>
            {user?.displayName ?? 'Admin'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            {user?.email ?? 'admin@partem.com.br'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={variant === 'permanent' ? true : open}
      onClose={onClose}
      sx={{
        width: variant === 'permanent' ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', border: 'none' },
      }}
    >
      {content}
    </Drawer>
  );
}
