import { useMemo } from 'react';
import {
  Box, Typography, Avatar, Chip, Paper, Divider, Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StarIcon from '@mui/icons-material/Star';
import BrushIcon from '@mui/icons-material/Brush';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { AppLayout } from '../components/layout/AppLayout';
import { useData } from '../contexts/DataContext';
import { computeGamificationStats } from '../utils/commissions';
import type { GamificationStats } from '../utils/commissions';

const TYPE_COLORS: Record<string, string> = {
  'social-media': '#0288D1',
  designer: '#7B1FA2',
  consultor: '#1565C0',
  filmmaker: '#C62828',
};

const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'];

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.min((score / max) * 100, 100) : 0;
  return (
    <Box sx={{ height: 6, bgcolor: 'action.hover', borderRadius: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          height: '100%', width: `${pct}%`,
          background: 'linear-gradient(90deg, #2D9D4E, #4CAF50)',
          borderRadius: 3,
          transition: 'width 0.6s ease',
        }}
      />
    </Box>
  );
}

function HighlightCard({ stats }: { stats: GamificationStats }) {
  const color = TYPE_COLORS[stats.profType] ?? '#64748B';
  const TYPE_LABEL_MAP: Record<string, string> = {
    consultor: 'Coordenador',
    'social-media': 'Social Mídia',
    designer: 'Designer',
    filmmaker: 'Gestor de Tráfego',
  };
  const typeLabel = TYPE_LABEL_MAP[stats.profType] ?? stats.profType;

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1D23 50%, #0A2A15 100%)',
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        mb: 4,
      }}
    >
      <Box sx={{
        position: 'absolute', top: -60, right: -60,
        width: 220, height: 220,
        bgcolor: '#F59E0B', opacity: 0.05, borderRadius: '50%',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -40, left: '40%',
        width: 160, height: 160,
        bgcolor: '#2D9D4E', opacity: 0.06, borderRadius: '50%',
      }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 26 }} />
        <Typography sx={{ color: '#F59E0B', fontWeight: 700, letterSpacing: 2, fontSize: '0.7rem', textTransform: 'uppercase' }}>
          Destaque do Mês
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        {/* Avatar */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            sx={{
              width: 80, height: 80,
              bgcolor: color,
              fontSize: '1.8rem', fontWeight: 800,
              border: '3px solid #F59E0B',
              boxShadow: '0 0 24px rgba(245,158,11,0.35)',
            }}
          >
            {getInitials(stats.profName)}
          </Avatar>
          <Box sx={{
            position: 'absolute', bottom: -4, right: -4,
            bgcolor: '#F59E0B', borderRadius: '50%',
            width: 26, height: 26,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StarIcon sx={{ fontSize: 14, color: '#000' }} />
          </Box>
        </Box>

        {/* Name + badge */}
        <Box sx={{ flex: 1, minWidth: 140 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {stats.profName}
          </Typography>
          <Chip
            label={typeLabel}
            size="small"
            sx={{ mt: 1, bgcolor: `${color}33`, color, fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>

        {/* Stats grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, flex: 2, minWidth: 240 }}>
          {[
            { label: 'Score', value: stats.score, color: '#FBBF24' },
            { label: 'Clientes', value: stats.activeClients, color: '#4ADE80' },
            { label: 'Renovações', value: stats.renewingClients, color: '#60A5FA' },
            { label: 'Pontualidade', value: `${stats.onTimeRate}%`, color: '#A7F3D0' },
            { label: 'Retenção', value: `${stats.retentionRate}%`, color: '#DDD6FE' },
            { label: 'Atrasos', value: stats.overdueClients, color: stats.overdueClients > 0 ? '#FCA5A5' : '#6B7280' },
          ].map((item) => (
            <Box key={item.label} sx={{ bgcolor: 'rgba(255,255,255,0.07)', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
              <Typography sx={{ color: item.color, fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>
                {item.value}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.25 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}

function RankingRow({ stats, rank, maxScore }: { stats: GamificationStats; rank: number; maxScore: number }) {
  const color = TYPE_COLORS[stats.profType] ?? '#64748B';
  const isTop3 = rank <= 3;
  const medColor = isTop3 ? MEDAL_COLORS[rank - 1] : '#94A3B8';

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 2,
        px: 2.5, py: 1.75,
        bgcolor: rank === 1 ? 'rgba(245,158,11,0.04)' : 'transparent',
        borderLeft: `3px solid ${rank === 1 ? '#F59E0B' : 'transparent'}`,
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'background 0.15s',
      }}
    >
      {/* Position badge */}
      <Box sx={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
        {isTop3 ? (
          <Typography sx={{ fontSize: '1.3rem' }}>{MEDAL_EMOJI[rank - 1]}</Typography>
        ) : (
          <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>{rank}º</Typography>
        )}
      </Box>

      <Avatar sx={{ width: 38, height: 38, bgcolor: color, fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
        {getInitials(stats.profName)}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }} noWrap>
          {stats.profName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={`${stats.activeClients} clientes`}
            size="small"
            sx={{ height: 18, fontSize: '0.62rem', bgcolor: alpha('#1565C0', 0.10), color: '#1565C0', fontWeight: 600 }}
          />
          <Chip
            label={`${stats.retentionRate}% retenção`}
            size="small"
            sx={{ height: 18, fontSize: '0.62rem', bgcolor: alpha('#2D9D4E', 0.10), color: '#2D9D4E', fontWeight: 600 }}
          />
          {stats.overdueClients > 0 && (
            <Chip
              icon={<WarningAmberIcon sx={{ fontSize: '11px !important' }} />}
              label={`${stats.overdueClients} atraso`}
              size="small"
              sx={{ height: 18, fontSize: '0.62rem', bgcolor: alpha('#DC2626', 0.10), color: '#DC2626', fontWeight: 600 }}
            />
          )}
        </Box>
      </Box>

      {/* Score bar */}
      <Box sx={{ width: { xs: 80, sm: 130 }, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>Score</Typography>
          <Typography sx={{ fontWeight: 800, color: medColor, fontSize: '0.8rem' }}>{stats.score}</Typography>
        </Box>
        <ScoreBar score={stats.score} max={maxScore} />
      </Box>

      {/* On-time rate */}
      <Tooltip title="Taxa de pontualidade de entregas" placement="left">
        <Box sx={{ textAlign: 'center', width: 52, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Typography
            sx={{
              fontWeight: 800, fontSize: '0.95rem',
              color: stats.onTimeRate >= 80 ? '#16a34a' : stats.onTimeRate >= 60 ? '#d97706' : '#dc2626',
            }}
          >
            {stats.onTimeRate}%
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.58rem' }}>no prazo</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}

function RankingPanel({
  title, icon, bgColor, chipColor, stats,
}: {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  chipColor: string;
  stats: GamificationStats[];
}) {
  const maxScore = stats.reduce((m, s) => Math.max(m, s.score), 0);

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: bgColor, borderBottom: 1, borderColor: 'divider' }}>
        {icon}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
        <Chip
          label={`${stats.length} profissional${stats.length !== 1 ? 'is' : ''}`}
          size="small"
          sx={{ ml: 'auto', bgcolor: chipColor, fontWeight: 600, fontSize: '0.65rem' }}
        />
      </Box>

      {stats.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">Nenhum profissional encontrado</Typography>
        </Box>
      ) : (
        stats.map((s, i) => (
          <Box key={s.profId}>
            <RankingRow stats={s} rank={i + 1} maxScore={maxScore} />
            {i < stats.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Paper>
  );
}

export function Gamification() {
  const { professionals, getClientsForProfessional } = useData();

  const allStats = useMemo(() => {
    return professionals
      .filter((p) => p.type !== 'filmmaker' && p.active)
      .map((p) => computeGamificationStats(p, getClientsForProfessional(p)))
      .sort((a, b) => b.score - a.score);
  }, [professionals, getClientsForProfessional]);

  const consultorStats = useMemo(() =>
    allStats.filter((s) => s.profType === 'consultor'),
    [allStats]);

  const smStats = useMemo(() =>
    allStats.filter((s) => s.profType === 'social-media'),
    [allStats]);

  const designerStats = useMemo(() =>
    allStats.filter((s) => s.profType === 'designer'),
    [allStats]);

  const destaque = allStats[0];

  return (
    <AppLayout title="Gamificação" subtitle="Ranking e performance dos colaboradores">
      {destaque && <HighlightCard stats={destaque} />}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
        <RankingPanel
          title="Coordenadores"
          icon={<RecordVoiceOverIcon sx={{ color: '#1565C0' }} />}
          bgColor="rgba(21,101,192,0.05)"
          chipColor="rgba(21,101,192,0.12)"
          stats={consultorStats}
        />
        <RankingPanel
          title="Social Mídia"
          icon={<TrendingUpIcon sx={{ color: '#0288D1' }} />}
          bgColor="rgba(2,136,209,0.05)"
          chipColor="rgba(2,136,209,0.12)"
          stats={smStats}
        />
        <RankingPanel
          title="Designers"
          icon={<BrushIcon sx={{ color: '#7B1FA2' }} />}
          bgColor="rgba(123,31,162,0.05)"
          chipColor="rgba(123,31,162,0.12)"
          stats={designerStats}
        />
      </Box>

      {/* Score legend */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <GroupsIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
            Como o Score é calculado
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'Cliente ativo', pts: '+10 pts', color: '#16a34a' },
            { label: 'Em renovação', pts: '+5 pts', color: '#0288D1' },
            { label: 'Cliente atrasado', pts: '-5 pts', color: '#dc2626' },
            { label: 'Bônus pontualidade', pts: 'até +20 pts', color: '#d97706' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.78rem', color: 'text.primary' }}>
                <Box component="span" sx={{ fontWeight: 700, color: item.color }}>{item.pts}</Box>
                {' '}por {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </AppLayout>
  );
}
