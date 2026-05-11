import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MethodData } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const COLORS = ['#7B3F00', '#1565C0', '#6A1B9A'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'var(--tooltip-bg, #fff)', border: '1px solid var(--tooltip-border, #E5E9EF)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
      <p style={{ fontWeight: 700, margin: '0 0 6px', color: 'inherit', fontSize: 13 }}>{d.name}</p>
      <p style={{ margin: '2px 0', color: 'inherit', fontSize: 12, opacity: 0.7 }}>Clientes: {d.totalClients} ({formatPercent(d.clientPercentage)})</p>
      <p style={{ margin: '2px 0', color: 'inherit', fontSize: 12, opacity: 0.7 }}>Recebido: {formatCurrency(d.receivedAmount)}</p>
      <p style={{ margin: '2px 0', color: 'inherit', fontSize: 12, opacity: 0.7 }}>A receber: {formatCurrency(d.pendingAmount)}</p>
      <p style={{ margin: '2px 0', color: 'inherit', fontSize: 12, opacity: 0.7 }}>Receita: {formatPercent(d.revenuePercentage)}</p>
    </div>
  );
}

type Props = { data: MethodData[] };

export function MethodChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="totalClients"
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(_value, entry: any) => (
            <span style={{ fontSize: 12, color: 'inherit', fontWeight: 600 }}>
              {entry.payload.name}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
