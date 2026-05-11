import { useMemo, useState } from 'react';
import {
  Box, Typography, Paper, Chip, Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupsIcon from '@mui/icons-material/Groups';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BrushIcon from '@mui/icons-material/Brush';
import { AppLayout } from '../components/layout/AppLayout';
import { useData } from '../contexts/DataContext';
import { computeMonthlyEarning } from '../utils/commissions';
import type { MonthlyEarning } from '../utils/commissions';
import { COMMISSION_RATES, getNextMonths } from '../config/commissions';
import { formatCurrency } from '../utils/formatters';

const CURRENT_MONTH = 'MAIO';
const CURRENT_YEAR = 2026;
const FORECAST_MONTHS = getNextMonths(CURRENT_MONTH, 4); // MAIO, JUNHO, JULHO, AGOSTO

function monthLabel(m: string) {
  const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
  return cap(m);
}

const TYPE_COLORS: Record<string, string> = {
  'social-media': '#0288D1',
  designer: '#7B1FA2',
};

const TYPE_LABELS: Record<string, string> = {
  'social-media': 'Social Mídia',
  designer: 'Designer',
};

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function SummaryCard({
  label, value, sub, icon, color,
}: {
  label: string; value: string; sub?: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
          {label}
        </Typography>
        <Box sx={{ bgcolor: `${color}14`, borderRadius: 1.5, p: 0.75, color }}>{icon}</Box>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>{value}</Typography>
      {sub && (
        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>{sub}</Typography>
      )}
    </Paper>
  );
}

function EarningRow({ earning }: { earning: MonthlyEarning }) {
  const color = TYPE_COLORS[earning.profType] ?? '#64748B';

  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: color, fontSize: '0.75rem', fontWeight: 700 }}>
            {getInitials(earning.profName)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{earning.profName}</Typography>
            <Chip
              label={TYPE_LABELS[earning.profType] ?? earning.profType}
              size="small"
              sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${color}14`, color, mt: 0.25 }}
            />
          </Box>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <GroupsIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{earning.activeClients}</Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <AutorenewIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{earning.renewingClients}</Typography>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <PersonAddAlt1Icon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{earning.referrals}</Typography>
        </Box>
      </TableCell>

      <TableCell align="right">
        <Tooltip title={`${earning.activeClients} clientes × ${formatCurrency(COMMISSION_RATES[earning.profType].monthlyPerClient)}/mês`}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>{formatCurrency(earning.baseEarning)}</Typography>
        </Tooltip>
      </TableCell>

      <TableCell align="right">
        <Typography
          variant="body2"
          sx={{ color: earning.renewalBonus > 0 ? '#16a34a' : 'text.disabled', fontWeight: earning.renewalBonus > 0 ? 600 : 400 }}
        >
          {earning.renewalBonus > 0 ? `+${formatCurrency(earning.renewalBonus)}` : '—'}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Typography
          variant="body2"
          sx={{ color: earning.referralBonus > 0 ? '#0288D1' : 'text.disabled', fontWeight: earning.referralBonus > 0 ? 600 : 400 }}
        >
          {earning.referralBonus > 0 ? `+${formatCurrency(earning.referralBonus)}` : '—'}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Box sx={(theme) => ({ bgcolor: theme.palette.mode === 'dark' ? 'rgba(22,163,74,0.12)' : '#F0FDF4', borderRadius: 1.5, px: 1.5, py: 0.5, display: 'inline-block' })}>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#16a34a' }}>
            {formatCurrency(earning.total)}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

function ForecastTable({
  earnings,
  months,
  profNames,
}: {
  earnings: Map<string, MonthlyEarning[]>; // month → earnings list
  months: string[];
  profNames: string[];
}) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Profissional</TableCell>
            {months.map((m) => (
              <TableCell key={m} align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                {monthLabel(m)}/{CURRENT_YEAR}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Total (4 meses)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {profNames.map((name) => {
            const rowTotal = months.reduce((sum, m) => {
              const e = earnings.get(m)?.find((x) => x.profName === name);
              return sum + (e?.total ?? 0);
            }, 0);
            return (
              <TableRow key={name} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>
                </TableCell>
                {months.map((m) => {
                  const e = earnings.get(m)?.find((x) => x.profName === name);
                  const isCurrentMonth = m === CURRENT_MONTH;
                  return (
                    <TableCell key={m} align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isCurrentMonth ? 700 : 400,
                          color: isCurrentMonth ? 'text.primary' : 'text.secondary',
                        }}
                      >
                        {e ? formatCurrency(e.total) : '—'}
                      </Typography>
                    </TableCell>
                  );
                })}
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#16a34a' }}>
                    {formatCurrency(rowTotal)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}

          {/* Month totals row */}
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Total do mês</TableCell>
            {months.map((m) => {
              const monthTotal = earnings.get(m)?.reduce((s, e) => s + e.total, 0) ?? 0;
              return (
                <TableCell key={m} align="right">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {formatCurrency(monthTotal)}
                  </Typography>
                </TableCell>
              );
            })}
            <TableCell align="right">
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#16a34a' }}>
                {formatCurrency(
                  months.reduce((s, m) => s + (earnings.get(m)?.reduce((x, e) => x + e.total, 0) ?? 0), 0),
                )}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function Variables() {
  const { professionals, getClientsForProfessional } = useData();
  const [typeFilter, setTypeFilter] = useState<'all' | 'social-media' | 'designer'>('all');

  const variablePros = useMemo(() =>
    professionals.filter((p) => (p.type === 'social-media' || p.type === 'designer') && p.active),
    [professionals],
  );

  const filteredPros = useMemo(() =>
    typeFilter === 'all' ? variablePros : variablePros.filter((p) => p.type === typeFilter),
    [variablePros, typeFilter],
  );

  // Current month earnings
  const currentMonthEarnings = useMemo(() =>
    filteredPros
      .map((p) => computeMonthlyEarning(p, getClientsForProfessional(p), CURRENT_MONTH, CURRENT_YEAR))
      .filter((e): e is MonthlyEarning => e !== null)
      .sort((a, b) => b.total - a.total),
    [filteredPros, getClientsForProfessional],
  );

  // Forecast for all 4 months
  const forecastMap = useMemo(() => {
    const map = new Map<string, MonthlyEarning[]>();
    for (const month of FORECAST_MONTHS) {
      const earnings = filteredPros
        .map((p) => computeMonthlyEarning(p, getClientsForProfessional(p), month, CURRENT_YEAR))
        .filter((e): e is MonthlyEarning => e !== null);
      map.set(month, earnings);
    }
    return map;
  }, [filteredPros, getClientsForProfessional]);

  const currentTotal = currentMonthEarnings.reduce((s, e) => s + e.total, 0);
  const smTotal = currentMonthEarnings.filter((e) => e.profType === 'social-media').reduce((s, e) => s + e.total, 0);
  const designerTotal = currentMonthEarnings.filter((e) => e.profType === 'designer').reduce((s, e) => s + e.total, 0);

  const forecastTotal = FORECAST_MONTHS.reduce((s, m) =>
    s + (forecastMap.get(m)?.reduce((x, e) => x + e.total, 0) ?? 0), 0);

  const profNames = filteredPros.map((p) => p.name);

  return (
    <AppLayout title="Variáveis" subtitle="Previsão de ganhos dos colaboradores por mês">
      {/* Summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <SummaryCard
          label="Total este mês"
          value={formatCurrency(currentTotal)}
          sub={`${currentMonthEarnings.length} profissionais`}
          icon={<AttachMoneyIcon sx={{ fontSize: 18 }} />}
          color="#16a34a"
        />
        <SummaryCard
          label="Social Mídia"
          value={formatCurrency(smTotal)}
          sub={`${currentMonthEarnings.filter((e) => e.profType === 'social-media').length} profissionais`}
          icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
          color="#0288D1"
        />
        <SummaryCard
          label="Designers"
          value={formatCurrency(designerTotal)}
          sub={`${currentMonthEarnings.filter((e) => e.profType === 'designer').length} designers`}
          icon={<BrushIcon sx={{ fontSize: 18 }} />}
          color="#7B1FA2"
        />
        <SummaryCard
          label="Previsão 4 meses"
          value={formatCurrency(forecastTotal)}
          sub="Mai → Ago/2026"
          icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
          color="#d97706"
        />
      </Box>

      {/* Current month breakdown */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Variáveis de {monthLabel(CURRENT_MONTH)}/{CURRENT_YEAR}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>Mês vigente — valores reais</Typography>
          </Box>
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={(_, v) => v && setTypeFilter(v)}
            size="small"
          >
            <ToggleButton value="all" sx={{ fontSize: '0.72rem', px: 1.5 }}>Todos</ToggleButton>
            <ToggleButton value="social-media" sx={{ fontSize: '0.72rem', px: 1.5 }}>Social Mídia</ToggleButton>
            <ToggleButton value="designer" sx={{ fontSize: '0.72rem', px: 1.5 }}>Designers</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Profissional</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                  <Tooltip title="Clientes ativos este mês"><span>Clientes</span></Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                  <Tooltip title="Clientes que renovam este mês"><span>Renovações</span></Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                  <Tooltip title="Indicações concretizadas este mês"><span>Indicações</span></Tooltip>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Base</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Bônus Renov.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Bônus Indic.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMonthEarnings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                    Nenhum dado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                currentMonthEarnings.map((e) => <EarningRow key={e.profId} earning={e} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Commission rates reference */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        {(['social-media', 'designer'] as const).map((type) => {
          const rates = COMMISSION_RATES[type];
          const color = TYPE_COLORS[type];
          const label = TYPE_LABELS[type];
          return (
            <Paper key={type} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{label}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {[
                  { label: 'Por cliente/mês', value: formatCurrency(rates.monthlyPerClient), color: 'text.primary' as const },
                  { label: 'Bônus renovação', value: formatCurrency(rates.renewalBonus), color: '#16a34a' },
                  { label: 'Bônus indicação', value: formatCurrency(rates.referralBonus), color: '#0288D1' },
                ].map((item) => (
                  <Box key={item.label} sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 1, flex: 1, minWidth: 80, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: item.color }}>{item.value}</Typography>
                    <Typography sx={{ color: 'text.disabled', fontSize: '0.62rem', mt: 0.25 }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Forecast table */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Previsão de ganhos — próximos 4 meses
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Baseada em clientes ativos e renovações confirmadas. Indicações futuras não incluídas.
          </Typography>
        </Box>

        <ForecastTable earnings={forecastMap} months={FORECAST_MONTHS} profNames={profNames} />

        <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.hover', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.68rem' }}>
            * Previsão conservadora: considera clientes ativos e renovações com status "SIM". Indicações futuras e novos clientes não estão incluídos.
          </Typography>
        </Box>
      </Paper>
    </AppLayout>
  );
}
