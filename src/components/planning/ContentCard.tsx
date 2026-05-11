import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';
import MovieIcon from '@mui/icons-material/Movie';
import { CONTENT_CONFIG, type ContentItem, getItemStatus } from '../../types/planning';

const STATUS_COLOR = {
  empty:    '#6B7280',
  partial:  '#FBBF24',
  complete: '#22C55E',
} as const;

const STATUS_LABEL = {
  empty:    'Vazio',
  partial:  'Em andamento',
  complete: 'Concluído',
} as const;

type Props = { item: ContentItem; hasScript?: boolean; onClick: () => void };

export function ContentCard({ item, hasScript, onClick }: Props) {
  const cfg = CONTENT_CONFIG[item.type];
  const status = getItemStatus(item);
  const isReel = item.type === 'reel';

  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 1px 0 rgba(0,0,0,0.5)'
          : '0 1px 0 rgba(9,30,66,0.25)',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s, transform 0.15s',
        '&:hover': {
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 16px rgba(0,0,0,0.5)'
            : '0 4px 16px rgba(9,30,66,0.2)',
          transform: 'translateY(-1px)',
        },
        position: 'relative',
        borderLeft: `3px solid ${cfg.color}`,
      })}
    >
      {/* Image area */}
      {item.imageBase64 ? (
        <Box sx={{ width: '100%', height: 120, position: 'relative', bgcolor: '#000', flexShrink: 0 }}>
          <Box
            component="img"
            src={item.imageBase64}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }}
          />
          {status === 'complete' && (
            <CheckCircleIcon sx={{ position: 'absolute', top: 6, right: 6, fontSize: 18, color: '#22C55E', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%', height: 72,
            bgcolor: alpha(cfg.color, 0.08),
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
          }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 22, color: alpha(cfg.color, 0.5) }} />
          <Typography sx={{ fontSize: '0.7rem', color: alpha(cfg.color, 0.6) }}>Adicionar imagem</Typography>
        </Box>
      )}

      {/* Body */}
      <Box sx={{ p: 1.25 }}>
        {/* Type + day row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Chip
            label={`${cfg.icon} ${cfg.label}`}
            size="small"
            sx={{
              height: 18, fontSize: '0.6rem', fontWeight: 700,
              bgcolor: alpha(cfg.color, 0.12), color: cfg.color,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
          <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 500 }}>
            {item.suggestedDay}
          </Typography>
        </Box>

        {/* Title */}
        <Tooltip title={item.title || ''} placement="top" disableHoverListener={!item.title}>
          <Typography
            sx={{
              fontSize: '0.82rem', fontWeight: 700,
              color: item.title ? 'text.primary' : 'text.disabled',
              mb: 0.5,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              lineHeight: 1.3, minHeight: '2.2em',
            }}
          >
            {item.title || 'Sem título'}
          </Typography>
        </Tooltip>

        {/* Support text preview */}
        {item.supportText && (
          <Typography
            sx={{
              fontSize: '0.72rem', color: 'text.secondary', mb: 0.75,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {item.supportText}
          </Typography>
        )}

        {/* Drive link */}
        {item.driveLink && (
          <Box
            component="a"
            href={item.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.75,
              textDecoration: 'none', color: 'primary.main',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <LinkIcon sx={{ fontSize: 12 }} />
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 600 }}>Ver referências no Drive</Typography>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_COLOR[status], flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{STATUS_LABEL[status]}</Typography>
          </Box>
          {isReel && (
            <Tooltip title={hasScript ? 'Roteiro preenchido' : 'Sem roteiro'} placement="top">
              <MovieIcon sx={{ fontSize: 14, color: hasScript ? cfg.color : 'text.disabled' }} />
            </Tooltip>
          )}
        </Box>

        {/* Progress bar */}
        <Box sx={(theme) => ({ mt: 0.75, height: 3, bgcolor: alpha(theme.palette.text.primary, 0.08), borderRadius: 2, overflow: 'hidden' })}>
          <Box
            sx={{
              height: '100%',
              width: status === 'empty' ? '0%' : status === 'partial' ? '50%' : '100%',
              bgcolor: STATUS_COLOR[status],
              borderRadius: 2, transition: 'width 0.3s',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
