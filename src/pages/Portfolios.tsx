import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Chip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import GroupsIcon from '@mui/icons-material/Groups';
import BrushIcon from '@mui/icons-material/Brush';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VideocamIcon from '@mui/icons-material/Videocam';
import GridViewIcon from '@mui/icons-material/GridView';
import { AppLayout } from '../components/layout/AppLayout';
import { ProfessionalCard } from '../components/professionals/ProfessionalCard';
import { useData } from '../contexts/DataContext';
import { getConsultantStats } from '../utils/calculations';
import type { ProfessionalType } from '../types';

type FilterKey = 'todos' | ProfessionalType;

const FILTERS: {
  key: FilterKey;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { key: 'todos',        label: 'Todos',             icon: <GridViewIcon sx={{ fontSize: 16 }} />,    color: '#64748B' },
  { key: 'consultor',    label: 'Coordenadores',      icon: <GroupsIcon sx={{ fontSize: 16 }} />,     color: '#1565C0' },
  { key: 'designer',     label: 'Designers',          icon: <BrushIcon sx={{ fontSize: 16 }} />,      color: '#7B1FA2' },
  { key: 'social-media', label: 'Social Mídia',        icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, color: '#0288D1' },
  { key: 'filmmaker',    label: 'Gestor de Tráfego',  icon: <VideocamIcon sx={{ fontSize: 16 }} />,   color: '#C62828' },
];

export function Portfolios() {
  const { clients, professionals, getClientsForProfessional } = useData();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');

  const professionalsWithStats = useMemo(() => {
    return professionals.map((prof) => {
      const profClients = getClientsForProfessional(prof);
      const stats = getConsultantStats(clients, prof.name);
      return {
        prof,
        stats: { ...stats, name: prof.name },
        clientNames: profClients.map((c) => c.name),
      };
    });
  }, [clients, professionals, getClientsForProfessional]);

  const displayed = useMemo(() => {
    if (activeFilter === 'todos') return professionalsWithStats;
    return professionalsWithStats.filter((p) => p.prof.type === activeFilter);
  }, [professionalsWithStats, activeFilter]);

  const countByType = useMemo(() => {
    const counts: Partial<Record<FilterKey, number>> = { todos: professionals.length };
    professionals.forEach((p) => {
      counts[p.type] = (counts[p.type] ?? 0) + 1;
    });
    return counts;
  }, [professionals]);

  const activeConfig = FILTERS.find((f) => f.key === activeFilter)!;

  return (
    <AppLayout
      title="Carteiras"
      subtitle={`${displayed.length} ${displayed.length === 1 ? 'profissional' : 'profissionais'} · ${clients.length} clientes`}
    >
      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mr: 0.5 }}>
          Filtrar por:
        </Typography>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          const count = countByType[f.key] ?? 0;
          return (
            <Chip
              key={f.key}
              icon={<Box sx={{ color: isActive ? f.color : 'text.secondary', display: 'flex', '& svg': { fontSize: '16px !important' } }}>{f.icon}</Box>}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <span>{f.label}</span>
                  <Box
                    sx={{
                      minWidth: 18, height: 18, borderRadius: '9px',
                      bgcolor: isActive ? f.color : 'action.selected',
                      color: isActive ? '#fff' : 'text.secondary',
                      fontSize: '0.65rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      px: 0.5,
                    }}
                  >
                    {count}
                  </Box>
                </Box>
              }
              onClick={() => setActiveFilter(f.key)}
              sx={{
                fontWeight: 600,
                fontSize: '0.825rem',
                px: 0.5,
                bgcolor: isActive ? alpha(f.color, 0.08) : 'action.hover',
                color: isActive ? f.color : 'text.primary',
                border: isActive ? `1.5px solid ${f.color}40` : '1.5px solid transparent',
                '&:hover': { bgcolor: isActive ? alpha(f.color, 0.14) : 'action.selected' },
                transition: 'all 0.15s ease',
              }}
            />
          );
        })}
      </Box>

      {/* Section header */}
      {activeFilter !== 'todos' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box sx={{ color: activeConfig.color, display: 'flex' }}>{activeConfig.icon}</Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: activeConfig.color }}>
            {activeConfig.label}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            — {displayed.length} {displayed.length === 1 ? 'profissional' : 'profissionais'}
          </Typography>
        </Box>
      )}

      {displayed.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body1">Nenhum profissional nesta categoria.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayed.map(({ prof, stats, clientNames }) => (
            <Grid key={prof.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ProfessionalCard
                stats={stats}
                clients={clientNames}
                type={prof.type}
                role={prof.role}
                onView={() => navigate(`/profissionais/${prof.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </AppLayout>
  );
}
