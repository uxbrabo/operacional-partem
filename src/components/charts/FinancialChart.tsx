import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import type { MonthlyForecast } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const COLORS = {
  lucas: '#1565C0',
  rodrigo: '#2D9D4E',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--tooltip-bg, #fff)', border: '1px solid var(--tooltip-border, #E5E9EF)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
      <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'inherit', fontSize: 13 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ margin: '4px 0', color: p.fill, fontWeight: 600, fontSize: 12 }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

type Props = { data: MonthlyForecast[] };

export function FinancialChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#8A94A6' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => v.split('/')[0]}
        />
        <YAxis
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#8A94A6' }}
          tickLine={false}
          axisLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="lucas" name="Lucas" fill={COLORS.lucas} radius={[4, 4, 0, 0]} />
        <Bar dataKey="rodrigo" name="Rodrigo" fill={COLORS.rodrigo} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
