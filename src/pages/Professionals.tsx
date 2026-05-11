import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { AppLayout } from '../components/layout/AppLayout';
import { ProfessionalCard } from '../components/professionals/ProfessionalCard';
import { useClients } from '../hooks/useClients';
import { useData } from '../contexts/DataContext';
import { getConsultantStats } from '../utils/calculations';

export function Professionals() {
  const { clients } = useClients();
  const { professionals, getClientsForProfessional } = useData();
  const navigate = useNavigate();

  const items = useMemo(() => {
    return professionals.map((prof) => {
      const profClients = getClientsForProfessional(prof);
      const stats = getConsultantStats(clients, prof.name);
      return { prof, stats: { ...stats, name: prof.name }, clientNames: profClients.map((c) => c.name) };
    });
  }, [clients, professionals, getClientsForProfessional]);

  return (
    <AppLayout title="Profissionais" subtitle="Visão por profissional">
      <Grid container spacing={3}>
        {items.map(({ prof, stats, clientNames }) => (
          <Grid key={prof.id} size={{ xs: 12, sm: 6, xl: 4 }}>
            <ProfessionalCard stats={stats} clients={clientNames} type={prof.type} role={prof.role} onView={() => navigate(`/profissionais/${prof.id}`)} />
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
}
