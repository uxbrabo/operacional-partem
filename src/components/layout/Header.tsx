import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Chip,
  Popover, List, ListItem, ListItemText, Badge, Tooltip,
  Divider, Button, Avatar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SIDEBAR_WIDTH } from './Sidebar';
import { useThemeMode } from '../../contexts/ThemeContext';

// ─── Mock notifications ────────────────────────────────────────────────────────
type NotifType = 'overdue' | 'delivery' | 'renewal' | 'approval';

interface Notif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  {
    id: '1', type: 'overdue', read: false,
    title: '3 clientes atrasados',
    body: 'Bistro Modigliani, Sabor do Nordeste e mais 1 aguardam atenção.',
    time: 'há 1 hora',
  },
  {
    id: '2', type: 'approval', read: false,
    title: 'Aprovação pendente',
    body: 'Etapa 2 da Psicóloga Giseli aguarda sua aprovação.',
    time: 'há 2 horas',
  },
  {
    id: '3', type: 'delivery', read: false,
    title: 'Entrega hoje',
    body: 'Bistro Modigliani tem entrega programada para hoje.',
    time: 'há 3 horas',
  },
  {
    id: '4', type: 'renewal', read: true,
    title: 'Renovação em 5 dias',
    body: 'Clínica Bella Vita renova em maio. Status: TALVEZ.',
    time: 'há 1 dia',
  },
  {
    id: '5', type: 'delivery', read: true,
    title: 'Entrega em 3 dias',
    body: 'Padaria Silva tem entrega prevista para sexta-feira.',
    time: 'há 1 dia',
  },
];

const NOTIF_CONFIG: Record<NotifType, { icon: React.ReactNode; color: string; label: string }> = {
  overdue:  { icon: <WarningAmberIcon sx={{ fontSize: 16 }} />,    color: '#DC2626', label: 'Atraso' },
  delivery: { icon: <LocalShippingIcon sx={{ fontSize: 16 }} />,   color: '#1565C0', label: 'Entrega' },
  renewal:  { icon: <AutorenewIcon sx={{ fontSize: 16 }} />,       color: '#2D9D4E', label: 'Renovação' },
  approval: { icon: <PendingIcon sx={{ fontSize: 16 }} />,         color: '#F57C00', label: 'Aprovação' },
};

// ─── Notification panel ────────────────────────────────────────────────────────
function NotifPanel({
  notifs,
  onMarkRead,
  onMarkAllRead,
}: {
  notifs: Notif[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}) {
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <Box sx={{ width: 360, maxWidth: '95vw' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'text.primary' }}>
            Notificações
          </Typography>
          {unread > 0 && (
            <Chip
              label={unread}
              size="small"
              sx={{
                height: 20, minWidth: 20, fontSize: '0.68rem', fontWeight: 800,
                bgcolor: alpha('#DC2626', 0.12), color: '#DC2626',
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
          )}
        </Box>
        {unread > 0 && (
          <Button
            size="small"
            onClick={onMarkAllRead}
            sx={{ fontSize: '0.72rem', fontWeight: 600, color: 'primary.main', p: 0, minWidth: 'auto' }}
          >
            Marcar todas como lidas
          </Button>
        )}
      </Box>

      <Divider />

      {/* List */}
      {notifs.length === 0 ? (
        <Box sx={{ py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <CheckCircleIcon sx={{ fontSize: 36, color: '#2D9D4E' }} />
          <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontWeight: 500 }}>
            Tudo em dia!
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {notifs.map((notif, idx) => {
            const cfg = NOTIF_CONFIG[notif.type];
            return (
              <React.Fragment key={notif.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => onMarkRead(notif.id)}
                  sx={(theme) => ({
                    px: 2.5, py: 1.5, cursor: 'pointer', gap: 1.5,
                    bgcolor: notif.read ? 'transparent' : alpha(cfg.color, theme.palette.mode === 'dark' ? 0.06 : 0.04),
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background 0.15s',
                  })}
                >
                  {/* Icon avatar */}
                  <Avatar
                    sx={{
                      width: 36, height: 36, flexShrink: 0, mt: 0.25,
                      bgcolor: alpha(cfg.color, 0.12), color: cfg.color,
                    }}
                  >
                    {cfg.icon}
                  </Avatar>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '0.82rem', fontWeight: notif.read ? 500 : 700,
                          color: 'text.primary', lineHeight: 1.3,
                        }}
                      >
                        {notif.title}
                      </Typography>
                      {!notif.read && (
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0, mt: 0.4 }} />
                      )}
                    </Box>
                    <Typography
                      sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.3, lineHeight: 1.4 }}
                    >
                      {notif.body}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{
                          height: 16, fontSize: '0.6rem', fontWeight: 700,
                          bgcolor: alpha(cfg.color, 0.10), color: cfg.color,
                          '& .MuiChip-label': { px: 0.6 },
                        }}
                      />
                      <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                        {notif.time}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                {idx < notifs.length - 1 && <Divider sx={{ mx: 2.5 }} />}
              </React.Fragment>
            );
          })}
        </List>
      )}

      {/* Footer */}
      <Divider />
      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', fontWeight: 500 }}>
          Apenas notificações recentes são exibidas
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────────
type Props = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  isMobile: boolean;
  actions?: React.ReactNode;
};

export function Header({ title, subtitle, onMenuClick, isMobile, actions }: Props) {
  const { mode, toggleMode } = useThemeMode();
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const open = Boolean(anchorEl);

  function handleOpenNotif(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleCloseNotif() {
    setAnchorEl(null);
  }

  function handleMarkRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function handleMarkAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          width: isMobile ? '100%' : `calc(100% - ${SIDEBAR_WIDTH}px)`,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
          zIndex: theme.zIndex.drawer - 1,
        })}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 3 } }}>
          {isMobile && (
            <IconButton onClick={onMenuClick} edge="start" sx={{ mr: 1, color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.125rem' }, color: 'text.primary' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mr: 1 }}>{actions}</Box>}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              label={today}
              size="small"
              sx={{
                display: { xs: 'none', md: 'flex' }, mr: 0.5,
                bgcolor: 'action.hover', color: 'text.secondary', fontSize: '0.7rem', fontWeight: 500,
              }}
            />

            {/* Dark mode toggle */}
            <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo escuro'} placement="bottom">
              <IconButton
                size="small"
                onClick={toggleMode}
                sx={(theme) => ({
                  color: 'text.secondary',
                  bgcolor: 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.mode === 'dark' ? '#FBBF24' : '#1565C0', 0.10),
                    color: theme.palette.mode === 'dark' ? '#FBBF24' : '#1565C0',
                  },
                  transition: 'color 0.2s, background 0.2s',
                })}
              >
                {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>

            {/* Notification bell */}
            <Tooltip title="Notificações" placement="bottom">
              <IconButton
                size="small"
                onClick={handleOpenNotif}
                sx={(theme) => ({
                  color: open ? 'primary.main' : 'text.secondary',
                  bgcolor: open ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' },
                  transition: 'color 0.2s, background 0.2s',
                })}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem', minWidth: 16, height: 16, px: 0.4,
                    },
                  }}
                >
                  <NotificationsNoneIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseNotif}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: (theme) => ({
              mt: 1,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.6)'
                : '0 8px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }),
          },
        }}
      >
        <NotifPanel
          notifs={notifs}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      </Popover>
    </>
  );
}
