import {
  Box, Grid, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, LinearProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import { AppLayout } from '../components/layout/AppLayout';
import { KPICard } from '../components/common/KPICard';
import { FinancialChart } from '../components/charts/FinancialChart';
import { MethodChart } from '../components/charts/MethodChart';
import { ConsultantRanking } from '../components/professionals/ConsultantRanking';
import { useDashboard } from '../hooks/useDashboard';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { LoadingState } from '../components/common/LoadingState';

const STAGE_COLORS: Record<string, string> = {
  'Etapa 1': '#1565C0',
  'Etapa 2': '#7B3F00',
  'Etapa 3': '#6A1B9A',
  'Etapa 4': '#2D9D4E',
  'Concluído': '#059669',
  'Cancelado': '#DC2626',
};

export function Dashboard() {
  const { data, loading } = useDashboard();

  return (
    <AppLayout title="Dashboard Financeiro" subtitle="Visão estratégica e financeira">
      {loading ? (
        <LoadingState message="Carregando dashboard..." />
      ) : data ? (
        <Box>
          {/* KPI Row */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPICard
                title="Portfólio Total"
                value={formatCurrency(data.portfolioTotal)}
                icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
                color="#2D9D4E"
                subtitle="Receita total contratada"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPICard
                title="Já Recebido"
                value={formatCurrency(data.alreadyReceived)}
                icon={<AccountBalanceWalletIcon sx={{ fontSize: 20 }} />}
                color="#059669"
                subtitle={`${formatPercent((data.alreadyReceived / data.portfolioTotal) * 100)} do portfólio`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPICard
                title="Ainda a Receber"
                value={formatCurrency(data.stillToReceive)}
                icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
                color="#F57C00"
                subtitle={`${formatPercent((data.stillToReceive / data.portfolioTotal) * 100)} do portfólio`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KPICard
                title="Clientes Ativos"
                value={data.activeClients}
                icon={<PeopleIcon sx={{ fontSize: 20 }} />}
                color="#1565C0"
                subtitle="Total de contratos vigentes"
              />
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
                    Previsão de Recebimento por Mês
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Distribuição por consultor
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <FinancialChart data={data.monthlyForecast} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
                    Clientes por Solução
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Participação por método
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <MethodChart data={data.methods} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom Row */}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                    Análise por Solução
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Método</TableCell>
                          <TableCell align="center">Clientes</TableCell>
                          <TableCell align="right">Recebido</TableCell>
                          <TableCell align="right">A receber</TableCell>
                          <TableCell align="center">% Cli.</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.methods.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{m.name}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">{m.totalClients}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ color: '#2D9D4E', fontWeight: 600 }}>{formatCurrency(m.receivedAmount)}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ color: '#F57C00', fontWeight: 600 }}>{formatCurrency(m.pendingAmount)}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'center' }}>
                                <LinearProgress variant="determinate" value={m.clientPercentage} sx={{ width: 40 }} />
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {formatPercent(m.clientPercentage)}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell sx={{ fontWeight: 800 }}>TOTAL</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800 }}>57</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: '#2D9D4E' }}>{formatCurrency(data.alreadyReceived)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 800, color: '#F57C00' }}>{formatCurrency(data.stillToReceive)}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800 }}>100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                    Já Recebido por Consultor
                  </Typography>
                  <ConsultantRanking data={data.consultantReceived} />
                  <Box sx={{ mt: 2.5, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {formatCurrency(data.consultantReceived.reduce((s, c) => s + c.received, 0))}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                    Clientes por Etapa
                  </Typography>
                  <Box>
                    {data.clientsByStage.map((s) => (
                      <Box key={s.stage} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: STAGE_COLORS[s.stage] ?? 'text.primary' }}>
                            {s.stage}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>{s.count}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(s.count / 57) * 100}
                          sx={{ '& .MuiLinearProgress-bar': { bgcolor: STAGE_COLORS[s.stage] ?? 'primary.main' } }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                          {s.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </AppLayout>
  );
}
