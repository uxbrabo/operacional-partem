import { useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Chip, Tabs, Tab,
  IconButton, Divider, InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LinkIcon from '@mui/icons-material/Link';
import { CONTENT_CONFIG, emptyScript, type ContentItem, type ReelScript, type ReelScene, compressImage } from '../../types/planning';

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange, aspect }: { value?: string; onChange: (b: string | undefined) => void; aspect: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const base64 = await compressImage(file);
    onChange(base64);
  };

  return (
    <Box
      onClick={() => !value && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      sx={{
        width: '100%', position: 'relative',
        paddingTop: aspect === '9/16' ? '56.25%' : '80%',
        bgcolor: 'action.hover',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        cursor: value ? 'default' : 'pointer',
        overflow: 'hidden',
        '&:hover': !value ? { borderColor: 'text.disabled', bgcolor: 'action.selected' } : {},
        transition: 'all 0.15s',
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      {value ? (
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <Box component="img" src={value} sx={{ width: '100%', height: '100%', objectFit: 'contain', bgcolor: '#000' }} />
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => inputRef.current?.click()} sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
              <AddPhotoAlternateIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onChange(undefined)} sx={{ bgcolor: 'rgba(220,38,38,0.8)', color: '#fff', '&:hover': { bgcolor: 'rgba(220,38,38,1)' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', textAlign: 'center' }}>
            Clique ou arraste uma imagem
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Reel Scene Row ───────────────────────────────────────────────────────────
function SceneRow({ scene, onChange, onDelete, canDelete }: {
  scene: ReelScene;
  onChange: (s: ReelScene) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const set = <K extends keyof ReelScene>(k: K, v: ReelScene[K]) => onChange({ ...scene, [k]: v });

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '20px 52px 1fr 1fr 1fr 28px', gap: 1, alignItems: 'flex-start', py: 1 }}>
      <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 16, mt: 1 }} />
      <TextField size="small" label="Dur." value={scene.duration} onChange={(e) => set('duration', e.target.value)}
        placeholder="5s" sx={{ '& .MuiInputBase-input': { fontSize: '0.78rem' } }} />
      <TextField size="small" label="Visual (o que filmar)" value={scene.visual} onChange={(e) => set('visual', e.target.value)}
        multiline maxRows={3} sx={{ '& .MuiInputBase-input': { fontSize: '0.78rem' } }} />
      <TextField size="small" label="Narração / áudio" value={scene.narration} onChange={(e) => set('narration', e.target.value)}
        multiline maxRows={3} sx={{ '& .MuiInputBase-input': { fontSize: '0.78rem' } }} />
      <TextField size="small" label="Texto na tela" value={scene.screenText} onChange={(e) => set('screenText', e.target.value)}
        multiline maxRows={3} sx={{ '& .MuiInputBase-input': { fontSize: '0.78rem' } }} />
      <IconButton size="small" onClick={onDelete} disabled={!canDelete} sx={{ color: 'error.main', mt: 0.5 }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ─── Reel Script Tab ──────────────────────────────────────────────────────────
function ReelScriptTab({ script, onChange }: { script: ReelScript; onChange: (s: ReelScript) => void }) {
  const set = <K extends keyof ReelScript>(k: K, v: ReelScript[K]) => onChange({ ...script, [k]: v });

  const addScene = () => {
    const next = script.scenes.length + 1;
    onChange({
      ...script,
      scenes: [...script.scenes, { id: `s${next}_${Date.now()}`, order: next, duration: '5s', visual: '', narration: '', screenText: '' }],
    });
  };

  const updateScene = (idx: number, s: ReelScene) => {
    const scenes = [...script.scenes];
    scenes[idx] = s;
    onChange({ ...script, scenes });
  };

  const deleteScene = (idx: number) => {
    onChange({ ...script, scenes: script.scenes.filter((_, i) => i !== idx) });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField size="small" label="Gancho / Abertura" value={script.hook} onChange={(e) => set('hook', e.target.value)}
          placeholder="Primeiros 3s para prender atenção..." multiline rows={2} />
        <TextField size="small" label="Objetivo do Reel" value={script.objective} onChange={(e) => set('objective', e.target.value)}
          placeholder="Gerar engajamento, mostrar produto..." multiline rows={2} />
      </Box>
      <TextField size="small" label="Trilha / Áudio sugerido" value={script.music} onChange={(e) => set('music', e.target.value)}
        placeholder="Nome da música ou estilo (ex: Lo-fi animado)" />

      <Divider />

      <Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '20px 52px 1fr 1fr 1fr 28px', gap: 1, mb: 0.5 }}>
          <Box />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Dur.</Typography>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Visual</Typography>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Narração</Typography>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Texto na tela</Typography>
          <Box />
        </Box>
        <Divider sx={{ mb: 0.5 }} />
        {script.scenes.map((scene, i) => (
          <Box key={scene.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.disabled', width: 20 }}>C{i + 1}</Typography>
            </Box>
            <SceneRow scene={scene} onChange={(s) => updateScene(i, s)} onDelete={() => deleteScene(i)} canDelete={script.scenes.length > 1} />
            {i < script.scenes.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>

      <Button startIcon={<AddIcon />} size="small" onClick={addScene} sx={{ alignSelf: 'flex-start', fontWeight: 600 }}>
        Adicionar cena
      </Button>
    </Box>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────
type Props = {
  item: ContentItem | null;
  script?: ReelScript;
  open: boolean;
  onClose: () => void;
  onSave: (item: ContentItem, script?: ReelScript) => void;
};

export function ContentEditDialog({ item, script, open, onClose, onSave }: Props) {
  const [tab, setTab] = useState(0);
  const [localItem, setLocalItem] = useState<ContentItem | null>(null);
  const [localScript, setLocalScript] = useState<ReelScript>(emptyScript());

  if (!localItem && item) {
    setLocalItem({ ...item });
    setLocalScript(script ?? emptyScript());
  }
  if (!item) return null;

  const working = localItem ?? item;
  const cfg = CONTENT_CONFIG[item.type];
  const isReel = item.type === 'reel';

  const set = <K extends keyof ContentItem>(k: K, v: ContentItem[K]) =>
    setLocalItem((p) => p ? ({ ...p, [k]: v }) : p);

  const handleSave = () => {
    if (working) onSave(working, isReel ? localScript : undefined);
    setLocalItem(null);
    onClose();
  };

  const handleClose = () => {
    setLocalItem(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Chip
          label={`${cfg.icon} ${cfg.label} ${item.pos} · Semana ${item.week}`}
          size="small"
          sx={{ bgcolor: alpha(cfg.color, 0.12), color: cfg.color, fontWeight: 700 }}
        />
        <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>— {item.suggestedDay}</Typography>
        {isReel && (
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ ml: 'auto', minHeight: 32, '& .MuiTab-root': { minHeight: 32, py: 0.5, fontSize: '0.8rem' } }}>
            <Tab label="Conteúdo" />
            <Tab label="Roteiro do Reel" />
          </Tabs>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {tab === 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' }, minHeight: 400 }}>
            {/* Image */}
            <Box sx={{ p: 2, bgcolor: '#000', display: 'flex', alignItems: 'center' }}>
              <ImageUpload
                value={working.imageBase64}
                onChange={(b) => set('imageBase64', b)}
                aspect={isReel || item.type === 'story' ? '9/16' : '4/5'}
              />
            </Box>

            {/* Fields */}
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth size="small" label="Título"
                value={working.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Título do conteúdo"
              />
              <TextField
                fullWidth size="small" label="Texto de apoio"
                value={working.supportText}
                onChange={(e) => set('supportText', e.target.value)}
                multiline rows={3}
                placeholder="Briefing para o designer / criativo..."
              />
              <TextField
                fullWidth size="small" label="Legenda (Caption)"
                value={working.caption}
                onChange={(e) => set('caption', e.target.value)}
                multiline rows={4}
                placeholder={"Escreva a legenda completa...\n\n#hashtag #hashtag"}
                helperText={`${working.caption.length} caracteres`}
              />
              <TextField
                fullWidth size="small" label="Link do Drive (referências)"
                value={working.driveLink ?? ''}
                onChange={(e) => set('driveLink', e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth size="small" label="Dia sugerido"
                value={working.suggestedDay}
                onChange={(e) => set('suggestedDay', e.target.value)}
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 2.5 }}>
            <ReelScriptTab script={localScript} onChange={setLocalScript} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
