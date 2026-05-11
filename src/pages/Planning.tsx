import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel,
  Chip, Button, Divider, IconButton, Tooltip,
  ToggleButtonGroup, ToggleButton, TextField, InputAdornment, Link,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress,
  Avatar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteForever';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HalfCircleIcon from '@mui/icons-material/Adjust';
import PersonIcon from '@mui/icons-material/Person';
import { alpha } from '@mui/material/styles';
import { AppLayout } from '../components/layout/AppLayout';
import { useData } from '../contexts/DataContext';
import { ContentCard } from '../components/planning/ContentCard';
import { ContentEditDialog } from '../components/planning/ContentEditDialog';
import {
  CONTENT_CONFIG, MONTHS_OPTIONS, METHOD_SCOPE,
  generateItems, loadPlans, savePlans, getItemStatus,
  type ContentItem, type ReelScript, type MonthlyPlan,
} from '../types/planning';

// ─── Print styles ──────────────────────────────────────────────────────────────
const PRINT_STYLE = `
@media print {
  body > * { display: none !important; }
  #print-area { display: block !important; }
  #print-area { position: fixed; inset: 0; background: #fff; overflow: auto; padding: 24px; }
  .no-print { display: none !important; }
  .week-col { page-break-inside: avoid; }
  .scene-table { font-size: 11px; }
}
`;
function usePrintStyle() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = PRINT_STYLE;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);
}

// ─── Demo seed ─────────────────────────────────────────────────────────────────
function buildDemoPlans(): MonthlyPlan[] {
  const mod = generateItems('SABOR');
  const pm = (id: string, p: Partial<ContentItem>) => { const i = mod.findIndex((x) => x.id === id); if (i >= 0) mod[i] = { ...mod[i], ...p }; };
  pm('w1_post_1', { title: 'Bem-vindo ao Modigliani Bistrô', supportText: 'Foto ambiente interno, mesa posta, luz âmbar. Mostrar a sofisticação do espaço.', caption: 'Cada detalhe foi pensado para transformar seu jantar em uma memória inesquecível. 🕯️🍷\n\nReserve sua mesa!\n\n📍 Boa Viagem, Recife\n\n#bistrô #gastronomia #recife', driveLink: 'https://drive.google.com/drive/folders/demo' });
  pm('w1_post_2', { title: 'Cardápio de Maio — Novidades', supportText: 'Foto close dos pratos principais novos. Luz natural, fundo desfocado.', caption: 'Nosso chef preparou surpresas deliciosas para este mês! 🍽️✨\n\n#novidades #cardapio #chefrecife' });
  pm('w1_story_1', { title: 'Bastidores da cozinha', supportText: 'Vídeo curto do chef preparando um prato. Texto: "Feito com amor ❤️"', caption: 'Por trás de cada prato, muita dedicação! 👨‍🍳' });
  pm('w1_story_2', { title: 'Reserve sua mesa', supportText: 'CTA para reservar. Template fundo escuro + logo.', caption: 'Reserve agora pelo link na bio! 🔗' });
  pm('w1_reel_1', { title: 'Tour pelo Modigliani', supportText: 'Reel mostrando os ambientes com música jazz. 30–45s.', caption: 'Venha conhecer cada cantinho! 😍\n\n#tour #restaurante #recife', driveLink: 'https://drive.google.com/drive/folders/demo-reel' });
  pm('w2_post_1', { title: 'Harmonização — Vinhos e Pratos', supportText: 'Foto dos pratos ao lado das garrafas selecionadas.', caption: 'A harmonização perfeita eleva qualquer refeição. 🍷🍝\n\n#sommelier #vinho' });

  const modScripts: Record<string, ReelScript> = {
    'w1_reel_1': {
      hook: 'Você conhece o restaurante mais charmoso de Recife?',
      objective: 'Gerar desejo de visitar. Aumentar reservas.',
      music: 'Jazz instrumental elegante',
      scenes: [
        { id: 's1', order: 1, duration: '3s', visual: 'Fachada à noite, iluminada', narration: 'Já conhece o Modigliani Bistrô?', screenText: 'O bistrô mais charmoso de Recife ✨' },
        { id: 's2', order: 2, duration: '5s', visual: 'Pan pelo salão — mesas postas, luz âmbar', narration: 'Um ambiente pensado em cada detalhe...', screenText: '' },
        { id: 's3', order: 3, duration: '5s', visual: 'Chef finalizando prato, vapor', narration: 'Pratos autorais feitos na hora.', screenText: 'Culinária autoral 🍽️' },
        { id: 's4', order: 4, duration: '3s', visual: 'Logo + endereço + CTA', narration: 'Reserve sua mesa. Link na bio!', screenText: '📍 Boa Viagem · Reserve pelo link na bio' },
      ],
    },
  };

  const plan1: MonthlyPlan = { id: 'demo_1_MAIO', clientId: '1', clientName: 'Modigliani Bistrô', method: 'SABOR', socialMediaName: 'Gabriel', month: 'MAIO', items: mod, scripts: modScripts, driveLink: 'https://drive.google.com/drive/folders/demo-modigliani', createdAt: '2026-05-01T10:00:00.000Z' };

  const gis = generateItems('CLÍNICA 360');
  const pg = (id: string, p: Partial<ContentItem>) => { const i = gis.findIndex((x) => x.id === id); if (i >= 0) gis[i] = { ...gis[i], ...p }; };
  pg('w1_post_1', { title: 'Saúde Mental em Maio', supportText: 'Arte clean, fundo branco, tipografia leve. Mensagem acolhedora.', caption: 'Cuidar da mente é um ato de coragem. 💙\n\nMaio Amarelo — agende sua consulta.\n\n#maioamarelo #saudemental #psicologa' });
  pg('w1_post_2', { title: 'Por que fazer terapia?', supportText: 'Carrossel 5 motivos. Design minimalista, tons de azul/verde.', caption: 'Ainda com dúvidas? Arraste ➡️\n\n#terapia #autoconhecimento' });
  pg('w1_post_3', { title: 'Depoimento de paciente', supportText: 'Citação anônima. Fundo suave, texto em destaque.', caption: '"Depois de 3 meses me reconheci de novo." — Paciente anônimo 💛\n\n#depoimento #transformacao' });
  pg('w1_reel_1', { title: '3 sinais que você precisa de terapia', supportText: 'Reel falado, corte rápido. Tom empático e direto.', caption: 'Você se identificou? 👇\n\nAgende: link na bio 🔗\n\n#terapia #saudemental' });

  const gisScripts: Record<string, ReelScript> = {
    'w1_reel_1': {
      hook: '3 sinais de que você precisa de terapia AGORA',
      objective: 'Gerar identificação e levar ao agendamento.',
      music: 'Lo-fi calmo, piano suave',
      scenes: [
        { id: 's1', order: 1, duration: '2s', visual: 'Texto animado no fundo branco', narration: '', screenText: '3 sinais que você PRECISA de terapia 🧠' },
        { id: 's2', order: 2, duration: '5s', visual: 'Psicóloga olhando para câmera', narration: 'Sinal 1: você se sente sobrecarregado o tempo todo.', screenText: '1. Sobrecarga constante 😔' },
        { id: 's3', order: 3, duration: '5s', visual: 'Corte — psicóloga gesticulando', narration: 'Sinal 2: suas emoções parecem grandes demais pra lidar.', screenText: '2. Emoções difíceis 💭' },
        { id: 's4', order: 4, duration: '5s', visual: 'Câmera mais próxima, tom acolhedor', narration: 'Sinal 3: você repete os mesmos padrões e não consegue sair.', screenText: '3. Padrões que se repetem 🔄' },
        { id: 's5', order: 5, duration: '3s', visual: 'CTA: link na bio', narration: 'Agende agora. O primeiro passo é o mais importante.', screenText: '🔗 Agende pelo link na bio' },
      ],
    },
  };

  const plan2: MonthlyPlan = { id: 'demo_16_MAIO', clientId: '16', clientName: 'Psicóloga Giseli Andrade', method: 'CLÍNICA 360', socialMediaName: 'Vitor', month: 'MAIO', items: gis, scripts: gisScripts, driveLink: '', createdAt: '2026-05-01T10:00:00.000Z' };

  const nord = generateItems('SABOR');
  const pn = (id: string, p: Partial<ContentItem>) => { const i = nord.findIndex((x) => x.id === id); if (i >= 0) nord[i] = { ...nord[i], ...p }; };
  pn('w1_post_1', { title: 'O Nordeste que a gente ama na sua mesa', supportText: 'Foto do prato carro-chefe. Cores quentes: laranja, vermelho tijolo.', caption: 'Tempero de mãe, cheiro de casa, sabor do Nordeste. 🌶️❤️\n\n#nordeste #comidanordestina #recife' });
  pn('w1_post_2', { title: 'Baião de dois — o clássico', supportText: 'Close do baião com temperos decorativos ao redor.', caption: 'Um clássico que nunca sai de moda. 🍛\n\n#baiaodetres #comidadenordeste' });

  const plan3: MonthlyPlan = { id: 'demo_2_MAIO', clientId: '2', clientName: 'Sabor da Nordeste', method: 'SABOR', socialMediaName: 'Anthony', month: 'MAIO', items: nord, scripts: {}, driveLink: 'https://drive.google.com/drive/folders/demo-nordeste', createdAt: '2026-05-01T10:00:00.000Z' };

  return [plan1, plan2, plan3];
}

function initPlans(): MonthlyPlan[] {
  const stored = loadPlans();
  if (stored.length > 0) return stored;
  const demos = buildDemoPlans();
  savePlans(demos);
  return demos;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function planProgress(plan: MonthlyPlan) {
  const total = plan.items.length;
  const complete = plan.items.filter((i) => getItemStatus(i) === 'complete').length;
  const partial = plan.items.filter((i) => getItemStatus(i) === 'partial').length;
  const pct = total > 0 ? Math.round(((complete + partial * 0.5) / total) * 100) : 0;
  return { total, complete, partial, pct };
}

const METHOD_COLORS: Record<string, string> = {
  SABOR: '#F97316',
  'CLÍNICA 360': '#0EA5E9',
  'CLÍNICA 180': '#10B981',
};

// ─── New Plan Dialog ───────────────────────────────────────────────────────────
function NewPlanDialog({ open, onClose, onCreate, clients, professionals, existingPlans }: {
  open: boolean;
  onClose: () => void;
  onCreate: (plan: MonthlyPlan) => void;
  clients: ReturnType<typeof useData>['clients'];
  professionals: ReturnType<typeof useData>['professionals'];
  existingPlans: MonthlyPlan[];
}) {
  const [clientId, setClientId] = useState('');
  const [month, setMonth] = useState(MONTHS_OPTIONS[new Date().getMonth()]);
  const [smDialogFilter, setSmDialogFilter] = useState('TODOS');

  const smProfNames = useMemo(() => {
    const fromProfs = professionals.filter((p) => p.type === 'social-media' && p.active).map((p) => p.name);
    const fromClients = clients.filter((c) => c.socialMedia).map((c) => c.socialMedia!);
    return Array.from(new Set([...fromProfs, ...fromClients])).sort();
  }, [professionals, clients]);

  const smClients = clients.filter((c) => {
    if (!c.socialMedia) return false;
    if (smDialogFilter !== 'TODOS' && c.socialMedia !== smDialogFilter) return false;
    return true;
  });
  const selectedClient = clients.find((c) => c.id === clientId);

  const alreadyExists = existingPlans.some((p) => p.clientId === clientId && p.month === month);

  const handleCreate = () => {
    if (!selectedClient) return;
    const plan: MonthlyPlan = {
      id: `${clientId}_${month}_${Date.now()}`,
      clientId,
      clientName: selectedClient.name,
      method: selectedClient.method,
      socialMediaName: selectedClient.socialMedia ?? '',
      month,
      items: generateItems(selectedClient.method),
      scripts: {},
      driveLink: '',
      createdAt: new Date().toISOString(),
    };
    onCreate(plan);
    setClientId('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Novo Planejamento</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        {/* SM filter */}
        <Box>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 0.75 }}>Filtrar por Social Media</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {['TODOS', ...smProfNames].map((name) => (
              <Chip
                key={name}
                label={name === 'TODOS' ? 'Todos' : name}
                size="small"
                onClick={() => { setSmDialogFilter(name); setClientId(''); }}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  bgcolor: smDialogFilter === name ? '#1565C0' : 'action.hover',
                  color: smDialogFilter === name ? '#fff' : 'text.primary',
                  '&:hover': { bgcolor: smDialogFilter === name ? '#1565C0' : 'action.selected' },
                }}
              />
            ))}
          </Box>
        </Box>

        <FormControl size="small" fullWidth>
          <InputLabel>Cliente</InputLabel>
          <Select value={clientId} label="Cliente" onChange={(e) => setClientId(e.target.value)}>
            <MenuItem value=""><em>Selecione ({smClients.length} disponíveis)</em></MenuItem>
            {smClients.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>{c.name}</Box>
                  <Chip label={c.method} size="small" sx={{ fontSize: '0.6rem', height: 16 }} />
                  {c.socialMedia && (
                    <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{c.socialMedia}</Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel>Mês</InputLabel>
          <Select value={month} label="Mês" onChange={(e) => setMonth(e.target.value)}>
            {MONTHS_OPTIONS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        {selectedClient && (
          <Box sx={{ p: 1.5, bgcolor: `${METHOD_COLORS[selectedClient.method]}10`, borderRadius: 2, border: `1px solid ${METHOD_COLORS[selectedClient.method]}30` }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: METHOD_COLORS[selectedClient.method] }}>{selectedClient.method}</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.25 }}>{METHOD_SCOPE[selectedClient.method].desc}</Typography>
            {selectedClient.socialMedia && (
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.25 }}>SM: {selectedClient.socialMedia}</Typography>
            )}
          </Box>
        )}
        {alreadyExists && (
          <Typography sx={(theme) => ({ fontSize: '0.78rem', color: '#D97706', bgcolor: alpha('#D97706', theme.palette.mode === 'dark' ? 0.15 : 0.08), p: 1, borderRadius: 1 })}>
            ⚠️ Já existe um planejamento para este cliente em {month}. Criar irá sobrescrever.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button variant="contained" onClick={handleCreate} disabled={!clientId}>
          Criar Planejamento
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Dashboard Card ────────────────────────────────────────────────────────────
function PlanCard({ plan, onClick, onDelete }: { plan: MonthlyPlan; onClick: () => void; onDelete: () => void }) {
  const { complete, partial, pct } = planProgress(plan);
  const methodColor = METHOD_COLORS[plan.method] ?? '#6B7280';
  const status = pct === 100 ? 'complete' : pct > 0 ? 'partial' : 'empty';

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 0, borderRadius: 2, cursor: 'pointer', overflow: 'hidden',
        border: '1px solid', borderColor: 'divider',
        transition: 'box-shadow 0.15s, transform 0.15s',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
      }}
    >
      {/* Color bar */}
      <Box sx={{ height: 4, bgcolor: methodColor }} />

      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'text.primary', lineHeight: 1.3 }}>
              {plan.clientName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <Chip label={plan.method} size="small"
                sx={{ fontSize: '0.6rem', height: 18, bgcolor: `${methodColor}15`, color: methodColor, fontWeight: 700, '& .MuiChip-label': { px: 0.75 } }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <CalendarTodayIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
                <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>{plan.month}</Typography>
              </Box>
            </Box>
          </Box>
          <Tooltip title="Excluir planejamento">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(); }}
              sx={{ color: 'text.disabled', '&:hover': { color: '#EF4444' }, p: 0.5 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* SM */}
        {plan.socialMediaName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
            <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem', bgcolor: alpha('#4F46E5', 0.12), color: '#4F46E5' }}>
              <PersonIcon sx={{ fontSize: 12 }} />
            </Avatar>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{plan.socialMediaName}</Typography>
          </Box>
        )}

        {/* Progress */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              {complete} completos · {partial} parciais
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: status === 'complete' ? '#16A34A' : status === 'partial' ? '#D97706' : 'text.disabled' }}>
              {pct}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={pct}
            sx={{ height: 5, borderRadius: 3, bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': { bgcolor: status === 'complete' ? '#22C55E' : status === 'partial' ? '#FBBF24' : 'action.selected', borderRadius: 3 } }} />
        </Box>

        {/* Stats row */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {(['post', 'story', 'reel'] as const).map((type) => {
            const cfg = CONTENT_CONFIG[type];
            const typeItems = plan.items.filter((i) => i.type === type);
            if (typeItems.length === 0) return null;
            const done = typeItems.filter((i) => getItemStatus(i) === 'complete').length;
            return (
              <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <Typography sx={{ fontSize: '0.65rem' }}>{cfg.icon}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: done === typeItems.length ? '#16A34A' : 'text.disabled', fontWeight: 600 }}>
                  {done}/{typeItems.length}
                </Typography>
              </Box>
            );
          })}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {status === 'complete'
              ? <CheckCircleIcon sx={{ fontSize: 16, color: '#22C55E' }} />
              : status === 'partial'
              ? <HalfCircleIcon sx={{ fontSize: 16, color: '#FBBF24' }} />
              : <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

// ─── Board column ──────────────────────────────────────────────────────────────
function WeekColumn({ week, items, scripts, onEditItem, methodColor }: {
  week: number;
  items: ContentItem[];
  scripts: Record<string, ReelScript>;
  onEditItem: (item: ContentItem) => void;
  methodColor: string;
}) {
  const posts = items.filter((i) => i.type === 'post');
  const stories = items.filter((i) => i.type === 'story');
  const reels = items.filter((i) => i.type === 'reel');
  const complete = items.filter((i) => getItemStatus(i) === 'complete').length;

  const groups = [
    { type: 'post' as const, list: posts },
    { type: 'story' as const, list: stories },
    { type: 'reel' as const, list: reels },
  ].filter((g) => g.list.length > 0);

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.mode === 'dark' ? '#1C2030' : '#EBECF0',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
      })}
    >
      {/* Column header */}
      <Box sx={{ px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: methodColor }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
            Semana {week}
          </Typography>
        </Box>
        <Chip
          label={`${complete}/${items.length}`}
          size="small"
          sx={(theme) => ({
            height: 20, fontSize: '0.65rem', fontWeight: 700,
            bgcolor: complete === items.length ? alpha('#16A34A', 0.12) : theme.palette.background.paper,
            color: complete === items.length ? '#16A34A' : 'text.secondary',
          })}
        />
      </Box>

      {/* Cards */}
      <Box sx={{ px: 1, pb: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
        {groups.map(({ type, list }) => (
          <Box key={type}>
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, px: 0.5, mb: 0.5 }}>
              {CONTENT_CONFIG[type].icon} {CONTENT_CONFIG[type].label}s
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {list.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  hasScript={!!scripts[item.id]}
                  onClick={() => onEditItem(item)}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Print area ────────────────────────────────────────────────────────────────
function PrintArea({ plan }: { plan: MonthlyPlan }) {
  return (
    <Box id="print-area" sx={{ display: 'none' }}>
      <Box sx={{ mb: 3, pb: 2, borderBottom: '2px solid #E5E7EB' }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Planejamento de Conteúdo</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          {plan.clientName} · {plan.month} · {plan.method}
        </Typography>
        {plan.socialMediaName && <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>Social Media: {plan.socialMediaName}</Typography>}
        {plan.driveLink && <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>Drive: {plan.driveLink}</Typography>}
      </Box>
      {[1, 2, 3, 4].map((w) => {
        const wItems = plan.items.filter((i) => i.week === w && getItemStatus(i) !== 'empty');
        if (wItems.length === 0) return null;
        return (
          <Box key={w} className="week-col" sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, pb: 1, borderBottom: '1px solid #E5E7EB' }}>Semana {w}</Typography>
            {wItems.map((item) => {
              const cfg = CONTENT_CONFIG[item.type];
              const script = plan.scripts[item.id];
              return (
                <Box key={item.id} sx={{ mb: 3, p: 2, border: '1px solid', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Chip label={`${cfg.icon} ${cfg.label} ${item.pos}`} size="small"
                      sx={{ bgcolor: `${cfg.color}18`, color: cfg.color, fontWeight: 700 }} />
                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{item.suggestedDay}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: item.imageBase64 ? '180px 1fr' : '1fr', gap: 2 }}>
                    {item.imageBase64 && (
                      <Box component="img" src={item.imageBase64}
                        sx={{ width: '100%', borderRadius: 1, objectFit: 'contain', maxHeight: 260, bgcolor: '#000' }} />
                    )}
                    <Box>
                      {item.title && <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{item.title}</Typography>}
                      {item.supportText && <Box sx={{ mb: 1 }}><Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Texto de apoio</Typography><Typography sx={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{item.supportText}</Typography></Box>}
                      {item.caption && <Box><Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Legenda</Typography><Typography sx={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>{item.caption}</Typography></Box>}
                      {item.driveLink && <Typography sx={{ fontSize: '0.72rem', color: '#1565C0', mt: 0.75 }}>🔗 {item.driveLink}</Typography>}
                    </Box>
                  </Box>
                  {script && item.type === 'reel' && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E7EB' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>Roteiro do Reel</Typography>
                      {script.hook && <Typography sx={{ fontSize: '0.8rem', mb: 0.5 }}><b>Gancho:</b> {script.hook}</Typography>}
                      {script.objective && <Typography sx={{ fontSize: '0.8rem', mb: 0.5 }}><b>Objetivo:</b> {script.objective}</Typography>}
                      {script.music && <Typography sx={{ fontSize: '0.8rem', mb: 1 }}><b>Trilha:</b> {script.music}</Typography>}
                      {script.scenes.length > 0 && (
                        <Box className="scene-table" component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                          <Box component="thead"><Box component="tr" sx={{ bgcolor: 'action.hover' }}>
                            {['Cena', 'Dur.', 'Visual', 'Narração', 'Texto na tela'].map((h) => (
                              <Box component="th" key={h} sx={{ p: '4px 8px', border: '1px solid', textAlign: 'left', fontWeight: 700, fontSize: '0.65rem', color: 'text.secondary' }}>{h}</Box>
                            ))}
                          </Box></Box>
                          <Box component="tbody">
                            {script.scenes.map((s, i) => (
                              <Box component="tr" key={s.id}>
                                {[`C${i + 1}`, s.duration, s.visual, s.narration, s.screenText].map((val, j) => (
                                  <Box component="td" key={j} sx={{ p: '4px 8px', border: '1px solid', verticalAlign: 'top' }}>{val}</Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'board';

const METHOD_OPTIONS = ['TODOS', 'SABOR', 'CLÍNICA 360', 'CLÍNICA 180'] as const;

export function Planning() {
  usePrintStyle();
  const { clients, professionals } = useData();
  const [plans, setPlans] = useState<MonthlyPlan[]>(() => initPlans());
  const [view, setView] = useState<View>('dashboard');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [newPlanOpen, setNewPlanOpen] = useState(false);
  const [methodFilter, setMethodFilter] = useState<string>('TODOS');
  const [smFilter, setSmFilter] = useState<string>('TODOS');
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [editScript, setEditScript] = useState<ReelScript | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [driveInput, setDriveInput] = useState('');

  const activePlan = plans.find((p) => p.id === activePlanId) ?? null;

  // SM professionals from the actual registered professionals list
  const smProfessionals = useMemo(
    () => professionals.filter((p) => p.type === 'social-media' && p.active),
    [professionals]
  );
  // Names set for quick lookup (includes any client.socialMedia not yet in professionals — fallback)
  const smNames = useMemo(() => {
    const fromProfessionals = smProfessionals.map((p) => p.name);
    const fromClients = clients.filter((c) => c.socialMedia).map((c) => c.socialMedia!);
    return Array.from(new Set([...fromProfessionals, ...fromClients])).sort();
  }, [smProfessionals, clients]);

  // Filtered plans for dashboard
  const filteredPlans = useMemo(() => plans.filter((p) => {
    if (methodFilter !== 'TODOS' && p.method !== methodFilter) return false;
    if (smFilter !== 'TODOS' && p.socialMediaName !== smFilter) return false;
    return true;
  }), [plans, methodFilter, smFilter]);

  // Sync drive input with active plan
  useEffect(() => {
    setDriveInput(activePlan?.driveLink ?? '');
  }, [activePlan?.id]);

  function persistPlan(plan: MonthlyPlan) {
    setPlans((prev) => {
      const next = prev.map((p) => p.id === plan.id ? plan : p);
      savePlans(next);
      return next;
    });
  }

  function handleCreatePlan(plan: MonthlyPlan) {
    setPlans((prev) => {
      const filtered = prev.filter((p) => !(p.clientId === plan.clientId && p.month === plan.month));
      const next = [...filtered, plan];
      savePlans(next);
      return next;
    });
    setActivePlanId(plan.id);
    setView('board');
    setNewPlanOpen(false);
  }

  function handleDeletePlan(id: string) {
    setPlans((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePlans(next);
      return next;
    });
  }

  function handleOpenPlan(plan: MonthlyPlan) {
    setActivePlanId(plan.id);
    setView('board');
  }

  function handleOpenEdit(item: ContentItem) {
    setEditItem(item);
    setEditScript(activePlan?.scripts[item.id]);
    setDialogOpen(true);
  }

  function handleSaveItem(item: ContentItem, script?: ReelScript) {
    if (!activePlan) return;
    const items = activePlan.items.map((i) => i.id === item.id ? item : i);
    const scripts = { ...activePlan.scripts };
    if (script) scripts[item.id] = script;
    persistPlan({ ...activePlan, items, scripts });
  }

  const handleSaveDriveLink = useCallback(() => {
    if (!activePlan) return;
    persistPlan({ ...activePlan, driveLink: driveInput.trim() });
  }, [activePlan, driveInput]);

  const methodColor = activePlan ? (METHOD_COLORS[activePlan.method] ?? '#6B7280') : '#6B7280';
  const { pct } = activePlan ? planProgress(activePlan) : { pct: 0 };

  // ── Dashboard view ──────────────────────────────────────────────────────────
  if (view === 'dashboard') {
    return (
      <AppLayout
        title="Planejamento de Conteúdo"
        subtitle={`${plans.length} planejamento${plans.length !== 1 ? 's' : ''} criado${plans.length !== 1 ? 's' : ''}`}
        headerActions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewPlanOpen(true)} sx={{ fontWeight: 700 }}>
            Novo Planejamento
          </Button>
        }
      >
      <Box sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>

        {/* Summary stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {[
            { label: 'Total de planos', value: plans.length, color: '#1565C0' },
            { label: 'Concluídos', value: plans.filter((p) => planProgress(p).pct === 100).length, color: '#16A34A' },
            { label: 'Em andamento', value: plans.filter((p) => { const { pct } = planProgress(p); return pct > 0 && pct < 100; }).length, color: '#D97706' },
            { label: 'Sem conteúdo', value: plans.filter((p) => planProgress(p).pct === 0).length, color: 'text.secondary' },
          ].map((s) => (
            <Paper key={s.label} sx={{ p: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>{s.label}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 0.5 }}>Método</Typography>
            <ToggleButtonGroup value={methodFilter} exclusive onChange={(_, v) => { if (v) setMethodFilter(v); }} size="small"
              sx={{ '& .MuiToggleButton-root': { py: 0.4, px: 1.25, fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 } }}>
              {METHOD_OPTIONS.map((m) => <ToggleButton key={m} value={m}>{m === 'TODOS' ? 'Todos' : m}</ToggleButton>)}
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 0.5 }}>Social Media</Typography>
            <ToggleButtonGroup value={smFilter} exclusive onChange={(_, v) => { if (v) setSmFilter(v); }} size="small"
              sx={{ '& .MuiToggleButton-root': { py: 0.4, px: 1.25, fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 } }}>
              <ToggleButton value="TODOS">Todos</ToggleButton>
              {smNames.map((n) => <ToggleButton key={n} value={n}>{n}</ToggleButton>)}
            </ToggleButtonGroup>
          </Box>
        </Paper>

        {/* Plans grid */}
        {filteredPlans.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>📋</Typography>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Nenhum planejamento encontrado</Typography>
            <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', mt: 0.5 }}>Crie um novo planejamento para começar</Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setNewPlanOpen(true)} sx={{ mt: 2 }}>
              Criar Planejamento
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onClick={() => handleOpenPlan(plan)}
                onDelete={() => handleDeletePlan(plan.id)}
              />
            ))}
          </Box>
        )}

        <NewPlanDialog
          open={newPlanOpen}
          onClose={() => setNewPlanOpen(false)}
          onCreate={handleCreatePlan}
          clients={clients}
          professionals={professionals}
          existingPlans={plans}
        />
      </Box>
      </AppLayout>
    );
  }

  // ── Board view ──────────────────────────────────────────────────────────────
  if (!activePlan) { setView('dashboard'); return null; }

  return (
    <AppLayout
      title={activePlan.clientName}
      subtitle={`${activePlan.method} · ${activePlan.month}${activePlan.socialMediaName ? ` · SM: ${activePlan.socialMediaName}` : ''}`}
      noPadding
      headerActions={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => setView('dashboard')}
            sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Voltar
          </Button>
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => window.print()} className="no-print">
            Exportar
          </Button>
        </Box>
      }
    >
      {/* Info strip — drive link + progress */}
      <Box className="no-print" sx={{ px: 2.5, py: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {/* Method badge */}
        <Chip
          label={activePlan.method}
          size="small"
          sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: `${methodColor}15`, color: methodColor }}
        />

        {/* Drive link */}
        <TextField
          size="small"
          value={driveInput}
          onChange={(e) => setDriveInput(e.target.value)}
          onBlur={handleSaveDriveLink}
          placeholder="Cole o link da pasta do Drive com as referências..."
          sx={{ flex: 1, maxWidth: 420, '& .MuiInputBase-input': { fontSize: '0.8rem', py: '6px' } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><LinkIcon sx={{ fontSize: 15, color: 'text.secondary' }} /></InputAdornment> } }}
        />
        {activePlan.driveLink && (
          <Link href={activePlan.driveLink} target="_blank" rel="noopener noreferrer"
            sx={{ fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.4, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            <FolderIcon sx={{ fontSize: 15 }} /> Abrir Drive
          </Link>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {(['post', 'story', 'reel'] as const).map((type) => {
            const cfg = CONTENT_CONFIG[type];
            const typeItems = activePlan.items.filter((i) => i.type === type);
            if (typeItems.length === 0) return null;
            const done = typeItems.filter((i) => getItemStatus(i) === 'complete').length;
            return (
              <Typography key={type} sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                {cfg.icon}{' '}
                <Box component="span" sx={{ fontWeight: 700, color: done === typeItems.length ? '#16A34A' : 'text.primary' }}>{done}/{typeItems.length}</Box>
              </Typography>
            );
          })}
          <Divider orientation="vertical" flexItem />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: pct === 100 ? '#16A34A' : 'text.primary' }}>
            {pct}%
          </Typography>
          <Box sx={{ width: 80, height: 5, bgcolor: 'action.hover', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: pct === 100 ? '#22C55E' : methodColor, borderRadius: 3, transition: 'width 0.4s' }} />
          </Box>
        </Box>
      </Box>

      {/* Trello board */}
      <Box
        className="no-print"
        sx={(theme) => ({
          flex: 1,
          overflow: 'hidden',
          px: 2,
          py: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          minHeight: 0,
          bgcolor: theme.palette.mode === 'dark' ? '#0D1117' : '#F1F2F4',
        })}
      >
        {[1, 2, 3, 4].map((week) => (
          <WeekColumn
            key={week}
            week={week}
            items={activePlan.items.filter((i) => i.week === week)}
            scripts={activePlan.scripts}
            onEditItem={handleOpenEdit}
            methodColor={methodColor}
          />
        ))}
      </Box>

      {/* Print area */}
      <PrintArea plan={activePlan} />

      <ContentEditDialog
        item={editItem}
        script={editScript}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveItem}
      />
    </AppLayout>
  );
}
