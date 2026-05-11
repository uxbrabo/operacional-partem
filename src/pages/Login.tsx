import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, CircularProgress, Link, InputAdornment, IconButton, Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { login, forgotPassword } = useAuth();
  const [email, setEmail] = useState('admin@partem.com.br');
  const [password, setPassword] = useState('partem2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message ?? 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setResetSent(true);
    } catch {
      setError('Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F2417 0%, #1A6B33 50%, #2D9D4E 100%)',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Logo area */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64, height: 64, bgcolor: '#000', borderRadius: '18px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              mb: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
              <path d="M20 80V20h30c16 0 28 10 28 26s-12 26-28 26H44v8h-8l-16 0zM44 60h6c10 0 16-6 16-14s-6-14-16-14H44v28z" fill="#2D9D4E"/>
              <path d="M44 60h16c8 0 12 4 12 10s-4 10-12 10H44V60z" fill="#fff" opacity="0.7"/>
            </svg>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
            partem
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>
            Sistema Operacional Interno
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <CardContent sx={{ p: 4 }}>
            {!showReset ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                  Bem-vindo de volta
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Entre com suas credenciais para acessar o sistema.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 1 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link
                      component="button"
                      type="button"
                      variant="caption"
                      sx={{ color: '#2D9D4E', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => setShowReset(true)}
                    >
                      Esqueci minha senha
                    </Link>
                  </Box>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ height: 48, fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
                  </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>acesso demo</Typography>
                </Divider>
                <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    E-mail: <strong>admin@partem.com.br</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Senha: <strong>partem2026</strong>
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Recuperar senha
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Informe seu e-mail e enviaremos o link de recuperação.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {resetSent && <Alert severity="success" sx={{ mb: 2 }}>E-mail enviado! Verifique sua caixa de entrada.</Alert>}

                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button fullWidth variant="contained" size="large" disabled={loading} onClick={handleReset} sx={{ mb: 2, height: 48, fontWeight: 700 }}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Enviar link'}
                </Button>
                <Button fullWidth variant="text" onClick={() => { setShowReset(false); setResetSent(false); }}>
                  Voltar ao login
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', display: 'block', mt: 3 }}>
          © 2026 Partem — Sistema interno. Acesso restrito.
        </Typography>
      </Box>
    </Box>
  );
}
