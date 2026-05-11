import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../pages/Login';
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { Clients } from '../pages/Clients';
import { Tracking } from '../pages/Tracking';
import { Portfolios } from '../pages/Portfolios';
import { Professionals } from '../pages/Professionals';
import { ProfessionalDetail } from '../pages/ProfessionalDetail';
import { Collaborators } from '../pages/Collaborators';
import { CalendarPage } from '../pages/CalendarPage';
import { Gamification } from '../pages/Gamification';
import { Variables } from '../pages/Variables';
import { Planning } from '../pages/Planning';
import { Reports } from '../pages/Reports';
import { Settings } from '../pages/Settings';
import { Box, CircularProgress } from '@mui/material';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clientes" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/acompanhamento" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
      <Route path="/carteiras" element={<ProtectedRoute><Portfolios /></ProtectedRoute>} />
      <Route path="/profissionais" element={<ProtectedRoute><Professionals /></ProtectedRoute>} />
      <Route path="/profissionais/:id" element={<ProtectedRoute><ProfessionalDetail /></ProtectedRoute>} />
      <Route path="/colaboradores" element={<ProtectedRoute><Collaborators /></ProtectedRoute>} />
      <Route path="/calendario" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
      <Route path="/gamificacao" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
      <Route path="/variaveis" element={<ProtectedRoute><Variables /></ProtectedRoute>} />
      <Route path="/planejamento" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
      <Route path="/relatorios" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
