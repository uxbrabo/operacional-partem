import type { DashboardData } from '../../types';
import { MOCK_DASHBOARD } from '../../data/mockData';

export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_DASHBOARD;
}
