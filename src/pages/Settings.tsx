import { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, TextField, Button,
  Switch, FormControlLabel, Divider, Avatar, Chip, Alert,
  List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';

type SettingSection = 'empresa' | 'usuarios' | 'metodos' | 'visual' | 'firebase';

const SECTIONS: { value: SettingSection; label: string }[] = [
  { value: 'empresa', label: 'Dados da Empresa' },
  { value: 'usuarios', label: 'Usuários e Permissões' },
  { value: 'metodos', label: 'Métodos e Status' },
  { value: 'visual', label: 'Preferências Visuais' },
  { value: 'firebase', label: 'Integração Firebase' },
];

const MOCK_USERS = [
  { id: '1', name: 'Admin Partem', email: 'admin@partem.com.br', role: 'Administrador' },
  { id: '2', name: 'Lucas Coordenador', email: 'lucas@partem.com.br', role: 'Coordenador' },
  { id: '3', name: 'Rodrigo Coordenador', email: 'rodrigo@partem.com.br', role: 'Coordenador' },
];

export function Settings() {
  const { user } = useAuth();
  const [section, setSection] = useState<SettingSection>('empresa');
  const [saved, setSaved] = useState(false);

  // suppress unused warning
  void user;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <AppLayout title="Configurações">
      <Grid container spacing={3}>
        {/* Left menu */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ p: 1 }}>
              {SECTIONS.map((s) => (
                <Box
                  key={s.value}
                  onClick={() => setSection(s.value)}
                  sx={{
                    px: 2, py: 1.5, borderRadius: 2, cursor: 'pointer', mb: 0.5,
                    bgcolor: section === s.value ? 'primary.light' : 'transparent',
                    color: section === s.value ? 'primary.dark' : 'text.primary',
                    fontWeight: section === s.value ? 700 : 500,
                    fontSize: '0.875rem',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: section === s.value ? 'primary.light' : 'action.hover' },
                  }}
                >
                  {s.label}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {saved && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Configurações salvas com sucesso.</Alert>}

          {section === 'empresa' && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Dados da Empresa</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Nome da empresa" defaultValue="Partem" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="CNPJ" defaultValue="00.000.000/0001-00" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Endereço" defaultValue="" size="small" multiline rows={2} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="E-mail principal" defaultValue="contato@partem.com.br" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Telefone" defaultValue="" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                      Salvar alterações
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {section === 'usuarios' && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Usuários</Typography>
                  <Button startIcon={<PersonAddIcon />} variant="outlined" size="small">
                    Adicionar usuário
                  </Button>
                </Box>
                <List disablePadding>
                  {MOCK_USERS.map((u, i) => (
                    <>
                      <ListItem key={u.id} disableGutters>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', mr: 2, fontSize: '0.875rem' }}>
                          {u.name.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{u.name}</Typography>}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{u.email}</Typography>
                              <Chip label={u.role} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }} />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {i < MOCK_USERS.length - 1 && <Divider key={`div-${u.id}`} />}
                    </>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {section === 'metodos' && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Métodos disponíveis</Typography>
                {['SABOR', 'CLÍNICA 360', 'CLÍNICA 180'].map((m) => (
                  <Box key={m} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip label={m} size="small" sx={{ fontWeight: 700 }} />
                    <FormControlLabel control={<Switch defaultChecked size="small" />} label="Ativo" />
                  </Box>
                ))}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Status disponíveis</Typography>
                {['Não iniciada', 'Em execução', 'Em aprovação', 'Concluído', 'Cancelado'].map((s) => (
                  <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>{s}</Typography>
                    <FormControlLabel control={<Switch defaultChecked size="small" />} label="Ativo" />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {section === 'visual' && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Preferências Visuais</Typography>
                <FormControlLabel control={<Switch size="small" />} label="Modo escuro (em breve)" disabled sx={{ mb: 2, display: 'block' }} />
                <FormControlLabel control={<Switch defaultChecked size="small" />} label="Animações suaves" sx={{ mb: 2, display: 'block' }} />
                <FormControlLabel control={<Switch defaultChecked size="small" />} label="Alertas de atraso em destaque" sx={{ mb: 2, display: 'block' }} />
              </CardContent>
            </Card>
          )}

          {section === 'firebase' && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Integração Firebase</Typography>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  Atualmente usando dados mockados. Configure as variáveis de ambiente para conectar ao Firestore.
                </Alert>
                <Grid container spacing={2}>
                  {['API Key', 'Auth Domain', 'Project ID', 'Storage Bucket', 'Messaging Sender ID', 'App ID'].map((field) => (
                    <Grid key={field} size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label={field}
                        size="small"
                        type={field.includes('Key') ? 'password' : 'text'}
                        placeholder={`VITE_FIREBASE_${field.toUpperCase().replace(/ /g, '_')}`}
                        helperText="Configure no arquivo .env"
                      />
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12 }}>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                      Salvar configuração
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </AppLayout>
  );
}
