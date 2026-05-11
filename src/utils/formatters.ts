export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDays(days: number): string {
  if (days === 0) return 'Hoje';
  if (days > 0) return `+${days} dias`;
  return `${days} dias`;
}

export function capitalizeMonth(month: string): string {
  return month.charAt(0) + month.slice(1).toLowerCase();
}

export const MONTH_ORDER = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

export const ENTRY_MONTHS = ['FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'];
export const RENEWAL_MONTHS = ['ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO'];
export const CONSULTANTS = ['LUCAS', 'RODRIGO'];
export const METHODS = ['SABOR', 'CLÍNICA 360', 'CLÍNICA 180'];
export const STAGE_STATUSES = ['Não iniciada', 'Em execução', 'Em aprovação', 'Concluído', 'Cancelado'];
export const RENEWAL_STATUSES = ['SIM', 'NÃO', 'TALVEZ'];
