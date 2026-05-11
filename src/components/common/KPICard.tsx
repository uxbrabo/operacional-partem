import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import type { SxProps } from '@mui/material';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: { value: string; positive: boolean };
  loading?: boolean;
  sx?: SxProps;
  onClick?: () => void;
};

export function KPICard({ title, value, subtitle, icon, color = '#2D9D4E', trend, loading, sx, onClick }: Props) {
  if (loading) {
    return (
      <Card sx={{ height: '100%', ...sx }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="80%" height={40} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="50%" height={20} sx={{ mt: 0.5 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s',
        '&:hover': onClick ? { transform: 'translateY(-1px)', boxShadow: 4 } : {},
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}
          >
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                width: 36, height: 36, borderRadius: '10px',
                bgcolor: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1, mb: 0.5 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: trend.positive ? '#2D9D4E' : '#DC2626', fontSize: '0.75rem' }}
            >
              {trend.value}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
