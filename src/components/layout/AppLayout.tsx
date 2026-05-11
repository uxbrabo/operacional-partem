import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
};

export function AppLayout({ title, subtitle, children, headerActions, noPadding }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant={isMobile ? 'temporary' : 'permanent'}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setDrawerOpen(true)}
          isMobile={isMobile}
          actions={headerActions}
        />
        <Box sx={{ mt: '64px', p: noPadding ? 0 : { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
