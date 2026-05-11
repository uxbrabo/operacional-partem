export type CommissionRates = {
  monthlyPerClient: number;
  renewalBonus: number;
  referralBonus: number;
};

export const COMMISSION_RATES: Record<'social-media' | 'designer', CommissionRates> = {
  'social-media': {
    monthlyPerClient: 600,
    renewalBonus: 600,
    referralBonus: 1200,
  },
  designer: {
    monthlyPerClient: 400,
    renewalBonus: 400,
    referralBonus: 800,
  },
};

export const MONTHS_PT = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

export function monthLabel(month: string, year: number): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return `${cap(month)}/${year}`;
}

export function getNextMonths(startMonth: string, count: number): string[] {
  const idx = MONTHS_PT.indexOf(startMonth.toUpperCase());
  if (idx === -1) return [];
  return Array.from({ length: count }, (_, i) => MONTHS_PT[(idx + i) % 12]);
}
