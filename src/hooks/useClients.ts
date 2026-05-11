import { useState } from 'react';
import type { FilterState } from '../types';
import { useData } from '../contexts/DataContext';
import { filterClients, sortByDaysToDelivery } from '../utils/calculations';

export function useClients() {
  const { clients } = useData();

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    consultant: 'Todos',
    method: 'Todos',
    entryMonth: 'Todos',
    renewalMonth: 'Todos',
    stageStatus: 'Todos',
    willRenew: 'Todos',
    overdue: false,
  });

  const filteredClients = sortByDaysToDelivery(filterClients(clients, filters));

  return { clients, filteredClients, loading: false, error: null, filters, setFilters, refetch: () => {} };
}

export function useClientById(id: string) {
  const { clients } = useData();
  return { client: clients.find((c) => c.id === id) ?? null, loading: false };
}
