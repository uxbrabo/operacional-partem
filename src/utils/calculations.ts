import type { Client, StageStatus } from '../types';

export function getClientCurrentStage(client: Client): string {
  const { e1, e2, e3, e4 } = client.stages;
  if (e4.status === 'Concluído') return 'Concluído';
  if (e1.status === 'Cancelado' || e2.status === 'Cancelado') return 'Cancelado';
  if (e3.status === 'Concluído') return 'Etapa 4';
  if (e2.status === 'Concluído') return 'Etapa 3';
  if (e1.status === 'Concluído') return 'Etapa 2';
  return 'Etapa 1';
}

export function isClientCanceled(client: Client): boolean {
  return (
    client.stages.e1.status === 'Cancelado' ||
    client.stages.e2.status === 'Cancelado'
  );
}

export function isClientCompleted(client: Client): boolean {
  return client.stages.e4.status === 'Concluído';
}

export function isClientActive(client: Client): boolean {
  return !isClientCanceled(client) && !isClientCompleted(client);
}

export function isClientOverdue(client: Client): boolean {
  return client.daysToDelivery < 0 && isClientActive(client);
}

export function isClientWaitingApproval(client: Client): boolean {
  const stages = [client.stages.e1, client.stages.e2, client.stages.e3, client.stages.e4];
  return stages.some((s) => s.status === 'Em aprovação');
}

export function isClientDeliveryThisWeek(client: Client): boolean {
  return client.daysToDelivery >= 0 && client.daysToDelivery <= 7 && isClientActive(client);
}

export function isRenewalThisMonth(client: Client, currentMonth: string): boolean {
  return client.renewalMonth === currentMonth || client.renewalMonth === getNextMonth(currentMonth);
}

function getNextMonth(month: string): string {
  const months = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
  ];
  const idx = months.indexOf(month);
  if (idx === -1) return '';
  return months[(idx + 1) % 12];
}

export function getActiveClients(clients: Client[]): Client[] {
  return clients.filter(isClientActive);
}

export function getCanceledClients(clients: Client[]): Client[] {
  return clients.filter(isClientCanceled);
}

export function getCompletedClients(clients: Client[]): Client[] {
  return clients.filter(isClientCompleted);
}

export function getOverdueClients(clients: Client[]): Client[] {
  return clients.filter(isClientOverdue);
}

export function getWaitingApprovalClients(clients: Client[]): Client[] {
  return clients.filter(isClientWaitingApproval);
}

export function getWeeklyDeliveries(clients: Client[]): Client[] {
  return clients.filter(isClientDeliveryThisWeek);
}

export function getUpcomingRenewals(clients: Client[], currentMonth = 'MAIO'): Client[] {
  return clients.filter((c) => isRenewalThisMonth(c, currentMonth));
}

export function getTotalReceived(clients: Client[]): number {
  return clients.reduce((sum, c) => sum + c.receivedAmount, 0);
}

export function getTotalPending(clients: Client[]): number {
  return clients.reduce((sum, c) => sum + c.pendingAmount, 0);
}

export function getTotalPortfolio(clients: Client[]): number {
  return getTotalReceived(clients) + getTotalPending(clients);
}

export function getClientsByMethod(clients: Client[], method: string): Client[] {
  return clients.filter((c) => c.method === method);
}

export function getClientsByConsultant(clients: Client[], consultant: string): Client[] {
  return clients.filter((c) => c.consultant === consultant);
}

export function getClientsByRenewal(clients: Client[], status: string): Client[] {
  return clients.filter((c) => c.willRenew === status);
}

export function filterClients(
  clients: Client[],
  filter: {
    search?: string;
    consultant?: string;
    method?: string;
    entryMonth?: string;
    renewalMonth?: string;
    stageStatus?: string;
    willRenew?: string;
    overdue?: boolean;
  }
): Client[] {
  return clients.filter((c) => {
    if (filter.search && !c.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.consultant && filter.consultant !== 'Todos' && c.consultant !== filter.consultant) return false;
    if (filter.method && filter.method !== 'Todos' && c.method !== filter.method) return false;
    if (filter.entryMonth && filter.entryMonth !== 'Todos' && c.entryMonth !== filter.entryMonth) return false;
    if (filter.renewalMonth && filter.renewalMonth !== 'Todos' && c.renewalMonth !== filter.renewalMonth) return false;
    if (filter.stageStatus && filter.stageStatus !== 'Todos') {
      const stages = [c.stages.e1, c.stages.e2, c.stages.e3, c.stages.e4];
      if (!stages.some((s) => s.status === filter.stageStatus as StageStatus)) return false;
    }
    if (filter.willRenew && filter.willRenew !== 'Todos' && c.willRenew !== filter.willRenew) return false;
    if (filter.overdue && !isClientOverdue(c)) return false;
    return true;
  });
}

export function sortByDaysToDelivery(clients: Client[]): Client[] {
  return [...clients].sort((a, b) => a.daysToDelivery - b.daysToDelivery);
}

export function getConsultantStats(clients: Client[], consultantName: string) {
  const consultantClients = getClientsByConsultant(clients, consultantName);
  return {
    name: consultantName,
    total: consultantClients.length,
    active: getActiveClients(consultantClients).length,
    overdue: getOverdueClients(consultantClients).length,
    waitingApproval: getWaitingApprovalClients(consultantClients).length,
    received: getTotalReceived(consultantClients),
    pending: getTotalPending(consultantClients),
    willRenew: getClientsByRenewal(consultantClients, 'SIM').length,
    wontRenew: getClientsByRenewal(consultantClients, 'NÃO').length,
    maybeRenew: getClientsByRenewal(consultantClients, 'TALVEZ').length,
  };
}
