import { useState, useEffect } from 'react';
import type { DashboardData } from '../types';
import { getDashboardData } from '../services/firebase/dashboardService';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch(() => setError('Erro ao carregar dados do dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
