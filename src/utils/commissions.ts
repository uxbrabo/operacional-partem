import type { Client, Professional, ProfessionalType } from '../types';
import { COMMISSION_RATES } from '../config/commissions';
import { isClientActive, isClientOverdue } from './calculations';

export type GamificationStats = {
  profId: string;
  profName: string;
  profType: ProfessionalType;
  totalClients: number;
  activeClients: number;
  overdueClients: number;
  renewingClients: number;
  onTimeRate: number;
  retentionRate: number;
  score: number;
};

export type MonthlyEarning = {
  profId: string;
  profName: string;
  profType: 'social-media' | 'designer';
  month: string;
  activeClients: number;
  renewingClients: number;
  referrals: number;
  baseEarning: number;
  renewalBonus: number;
  referralBonus: number;
  total: number;
};

export function computeGamificationStats(
  prof: Professional,
  clients: Client[],
): GamificationStats {
  const total = clients.length;
  const active = clients.filter(isClientActive).length;
  const overdue = clients.filter(isClientOverdue).length;
  const renewing = clients.filter((c) => c.willRenew === 'SIM').length;

  const onTimeRate = active > 0 ? Math.round(((active - overdue) / active) * 100) : 100;
  const retentionRate = total > 0 ? Math.round((renewing / total) * 100) : 0;

  // Score: clients (10 pts each) + renewals (5 pts each) - overdue (-5 pts each) + onTime bonus
  const score = active * 10 + renewing * 5 - overdue * 5 + Math.round(onTimeRate * 0.2);

  return {
    profId: prof.id,
    profName: prof.name,
    profType: prof.type,
    totalClients: total,
    activeClients: active,
    overdueClients: overdue,
    renewingClients: renewing,
    onTimeRate,
    retentionRate,
    score: Math.max(0, score),
  };
}

export function computeMonthlyEarning(
  prof: Professional,
  clients: Client[],
  month: string, // 'MAIO'
  year: number,
): MonthlyEarning | null {
  const type = prof.type;
  if (type !== 'social-media' && type !== 'designer') return null;

  const rates = COMMISSION_RATES[type];
  const monthLabel = `${month}/${year}`;

  const activeClients = clients.filter(isClientActive).length;
  const renewingClients = clients.filter(
    (c) => c.renewalMonth === month && c.willRenew === 'SIM',
  ).length;
  const referrals = (prof.referrals ?? []).filter((r) => r.month === monthLabel).length;

  const baseEarning = activeClients * rates.monthlyPerClient;
  const renewalBonus = renewingClients * rates.renewalBonus;
  const referralBonus = referrals * rates.referralBonus;
  const total = baseEarning + renewalBonus + referralBonus;

  return {
    profId: prof.id,
    profName: prof.name,
    profType: type,
    month: monthLabel,
    activeClients,
    renewingClients,
    referrals,
    baseEarning,
    renewalBonus,
    referralBonus,
    total,
  };
}
