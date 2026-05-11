import { createTheme, alpha } from '@mui/material/styles';

const PARTEM_GREEN = '#2D9D4E';
const PARTEM_GREEN_DARK = '#1A6B33';
const PARTEM_GREEN_LIGHT = '#E8F5E9';

export function createAppTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: PARTEM_GREEN,
        dark: PARTEM_GREEN_DARK,
        light: '#4CAF74',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#1565C0',
        light: isDark ? '#1E3A5F' : '#E3F2FD',
        dark: '#0D47A1',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0F1117' : '#F4F6F9',
        paper: isDark ? '#1A1D23' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#1A1D23',
        secondary: isDark ? '#94A3B8' : '#5F6B7A',
      },
      error: { main: '#D32F2F', light: isDark ? '#3B1010' : '#FFEBEE' },
      warning: { main: '#F57C00', light: isDark ? '#3B2000' : '#FFF3E0' },
      success: { main: PARTEM_GREEN, light: isDark ? '#0D2A15' : PARTEM_GREEN_LIGHT },
      info: { main: '#0288D1', light: isDark ? '#0A2540' : '#E1F5FE' },
      divider: isDark ? '#2D3748' : '#E5E9EF',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2rem' },
      h2: { fontWeight: 700, fontSize: '1.75rem' },
      h3: { fontWeight: 600, fontSize: '1.5rem' },
      h4: { fontWeight: 600, fontSize: '1.25rem' },
      h5: { fontWeight: 600, fontSize: '1.125rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      body1: { fontSize: '0.9rem' },
      body2: { fontSize: '0.8rem' },
      caption: { fontSize: '0.75rem' },
    },
    shape: { borderRadius: 12 },
    shadows: [
      'none',
      isDark ? '0px 1px 3px rgba(0,0,0,0.3)' : '0px 1px 3px rgba(0,0,0,0.06)',
      isDark ? '0px 2px 6px rgba(0,0,0,0.4)' : '0px 2px 6px rgba(0,0,0,0.08)',
      isDark ? '0px 4px 12px rgba(0,0,0,0.4)' : '0px 4px 12px rgba(0,0,0,0.08)',
      isDark ? '0px 6px 16px rgba(0,0,0,0.5)' : '0px 6px 16px rgba(0,0,0,0.10)',
      isDark ? '0px 8px 24px rgba(0,0,0,0.5)' : '0px 8px 24px rgba(0,0,0,0.10)',
      ...Array(19).fill('none'),
    ] as any,
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isDark ? '#2D3748' : '#E5E9EF'}`,
            boxShadow: isDark ? '0px 1px 4px rgba(0,0,0,0.3)' : '0px 1px 4px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0px 4px 12px rgba(45,157,78,0.30)' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600, fontSize: '0.75rem' },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              backgroundColor: isDark ? '#1E2330' : '#F4F6F9',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isDark ? '#94A3B8' : '#5F6B7A',
              borderBottom: `2px solid ${isDark ? '#2D3748' : '#E5E9EF'}`,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': { backgroundColor: alpha(PARTEM_GREEN, isDark ? 0.08 : 0.04) },
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? '#1E2330' : '#F0F2F5'}`,
            padding: '10px 16px',
            fontSize: '0.875rem',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '& fieldset': { borderColor: isDark ? '#2D3748' : '#E5E9EF' },
              '&:hover fieldset': { borderColor: PARTEM_GREEN },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          outlined: { borderRadius: 10 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: 'none', boxShadow: isDark ? '2px 0 20px rgba(0,0,0,0.4)' : '2px 0 20px rgba(0,0,0,0.08)' },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            marginBottom: 2,
            '&.Mui-selected': {
              backgroundColor: isDark ? alpha(PARTEM_GREEN, 0.15) : PARTEM_GREEN_LIGHT,
              color: isDark ? PARTEM_GREEN : PARTEM_GREEN_DARK,
              '& .MuiListItemIcon-root': { color: isDark ? PARTEM_GREEN : PARTEM_GREEN_DARK },
              '&:hover': { backgroundColor: alpha(PARTEM_GREEN, isDark ? 0.22 : 0.16) },
            },
            '&:hover': { backgroundColor: alpha(PARTEM_GREEN, isDark ? 0.10 : 0.06) },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, height: 8, backgroundColor: isDark ? '#2D3748' : '#E5E9EF' },
          bar: { borderRadius: 4 },
        },
      },
      MuiAlert: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--tooltip-bg': isDark ? '#1E2330' : '#ffffff',
            '--tooltip-border': isDark ? '#2D3748' : '#E5E9EF',
          },
        },
      },
    },
  });
}

export const theme = createAppTheme('light');
