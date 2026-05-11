import type {
  Client,
  DashboardData,
  Professional,
} from '../types';

export const MOCK_CLIENTS: Client[] = [
  // FEVEREIRO - SABOR
  {
    id: '1', name: 'Modigliani Bistrô', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 3, receivedAmount: 8075, pendingAmount: 2025,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '2', name: 'Sabor da Nordeste', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '3', name: 'Capitão HotDog', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '4', name: 'Parma Deli', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '5', name: 'Duda Montenegro Cake Shop', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: 7, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '6', name: 'Restaurante Imperador', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: 7, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '7', name: 'Terraço Gourmet', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: 7, willRenew: 'SIM', notes: 'TAL...', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '8', name: 'Patty Doceria', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '9', name: 'Medellin Burguer', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '10', name: 'Max Burguer', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '11', name: 'Imperial Padaria', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '12', name: 'Taiyang Oriental', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '13', name: 'Restaurante Va Long', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8100, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '14', name: 'Lojas CAB', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 8075, pendingAmount: 25,
    renewalMonth: 'MAIO', daysToDelivery: 0, willRenew: 'NÃO', notes: 'TAL...', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  // FEVEREIRO - CLÍNICA 360
  {
    id: '15', name: 'Dra Cecília Andrade', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 7875, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '16', name: 'Psicóloga Giseli Andrade', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 7875, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '17', name: 'Clínica Change', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 7875, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '18', name: 'Clínica Esmere', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 7875, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '19', name: 'Taramão Fisioterapia', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 5250, pendingAmount: 2625,
    renewalMonth: 'MAIO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '20', name: 'Meu Mojo', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '18/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e3: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
      e4: { status: 'Concluído', date: '13/04/2026', receivedDate: '13/04/2026' },
    },
    completedStages: 4, receivedAmount: 7875, pendingAmount: 0,
    renewalMonth: 'MAIO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '21', name: 'Kinkas Sushi', entryMonth: 'FEVEREIRO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '18/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2025, pendingAmount: 6075,
    renewalMonth: 'JUNHO', daysToDelivery: 9, willRenew: 'SIM', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  {
    id: '22', name: 'Instituto Entrelares', entryMonth: 'FEVEREIRO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '01/04/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Cancelado', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Cancelado', date: '', receivedDate: '' },
      e4: { status: 'Cancelado', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 0,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'NÃO', notes: '', createdAt: '2026-02-01', updatedAt: '2026-05-04',
  },
  // MARÇO
  {
    id: '23', name: 'Clínica Realizar', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '11/05/2026' },
      e2: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 5250,
    renewalMonth: 'JUNHO', daysToDelivery: 7, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '24', name: 'Forneria 1121', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '25', name: 'Paranoia do Mar', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '26', name: 'Carpe Diem', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Em execução', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2025, pendingAmount: 6075,
    renewalMonth: 'JUNHO', daysToDelivery: 28, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '27', name: 'Espaço Cognição', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '01/04/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 5250,
    renewalMonth: 'JUNHO', daysToDelivery: -33, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '28', name: 'Clínica Ame Muito Mais', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Em execução', date: '01/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 7875,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: '', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '29', name: 'Bellas Corpus', entryMonth: 'MARÇO', method: 'CLÍNICA 180', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 3000, pendingAmount: 10500,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: '', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '30', name: 'Tha Belha', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '01/04/2026' },
      e2: { status: 'Cancelado', date: '', receivedDate: '' },
      e3: { status: 'Cancelado', date: '', receivedDate: '' },
      e4: { status: 'Cancelado', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 1500, pendingAmount: 0,
    renewalMonth: '', daysToDelivery: 0, willRenew: 'NÃO', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '31', name: 'Seu Lenha', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Concluído', date: '27/04/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: -7, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '32', name: 'Dubom Gelados', entryMonth: 'MARÇO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: -7, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '33', name: 'Lusitosa Psicologia', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 5250, pendingAmount: 2625,
    renewalMonth: 'JUNHO', daysToDelivery: -33, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '34', name: 'Instituto Confiar', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '19/03/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 5250,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '35', name: 'Miss Bonita', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '08/04/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Cancelado', date: '', receivedDate: '' },
      e3: { status: 'Cancelado', date: '', receivedDate: '' },
      e4: { status: 'Cancelado', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 0,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'NÃO', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '36', name: 'Restimed', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Em execução', date: '01/06/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 7875,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '37', name: 'Dra Paloma', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Não iniciada', date: '01/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 10500,
    renewalMonth: 'JUNHO', daysToDelivery: -14, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '38', name: 'Laços Voss', entryMonth: 'MARÇO', method: 'CLÍNICA 180', consultant: '',
    stages: {
      e1: { status: 'Em execução', date: '01/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 4500,
    renewalMonth: 'JUNHO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '39', name: 'The Sushi Prime', entryMonth: 'MARÇO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '09/04/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '40', name: 'Lana Valentim', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '01/05/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Em execução', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 5250,
    renewalMonth: 'JUNHO', daysToDelivery: -21, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '41', name: 'Dra Sara Bitu', entryMonth: 'MARÇO', method: 'CLÍNICA 360', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Concluído', date: '01/05/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Em execução', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 1, receivedAmount: 2625, pendingAmount: 5250,
    renewalMonth: 'JUNHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '42', name: 'Dra Paloma (CLÍNICA 180)', entryMonth: 'MARÇO', method: 'CLÍNICA 180', consultant: '',
    stages: {
      e1: { status: 'Em execução', date: '01/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 6000,
    renewalMonth: 'JULHO', daysToDelivery: -14, willRenew: '', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '43', name: "Bailsac's", entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '04/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '44', name: 'BRASS Pizzaria', entryMonth: 'MARÇO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Concluído', date: '13/04/2026', receivedDate: '04/05/2026' },
      e2: { status: 'Concluído', date: '04/05/2026', receivedDate: '04/05/2026' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 2, receivedAmount: 4050, pendingAmount: 4050,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '45', name: 'Da Fonte Distribuidora', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  // ABRIL
  {
    id: '46', name: 'Arrazuz Fit', entryMonth: 'ABRIL', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: -7, willRenew: 'SIM', notes: '', createdAt: '2026-04-01', updatedAt: '2026-05-04',
  },
  {
    id: '47', name: 'Pizzaria Speciale', entryMonth: 'ABRIL', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: -7, willRenew: 'SIM', notes: '', createdAt: '2026-04-01', updatedAt: '2026-05-04',
  },
  {
    id: '48', name: 'Fazenda Tubiba', entryMonth: 'ABRIL', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-04-01', updatedAt: '2026-05-04',
  },
  {
    id: '49', name: 'Geração Burguer', entryMonth: 'ABRIL', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-04-01', updatedAt: '2026-05-04',
  },
  {
    id: '50', name: "Teco's Brownis", entryMonth: 'ABRIL', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-04-01', updatedAt: '2026-05-04',
  },
  // MAIO
  {
    id: '51', name: 'Visca Burguer', entryMonth: 'MAIO', method: 'SABOR', consultant: 'RODRIGO',
    stages: {
      e1: { status: 'Não iniciada', date: '07/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'AGOSTO', daysToDelivery: 3, willRenew: 'SIM', notes: '', createdAt: '2026-05-01', updatedAt: '2026-05-04',
  },
  {
    id: '52', name: 'Dra Jessica 180', entryMonth: 'MAIO', method: 'CLÍNICA 180', consultant: '',
    stages: {
      e1: { status: 'Não iniciada', date: '07/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 10500,
    renewalMonth: 'AGOSTO', daysToDelivery: 3, willRenew: '', notes: '', createdAt: '2026-05-01', updatedAt: '2026-05-04',
  },
  {
    id: '53', name: 'CarollaVida', entryMonth: 'MAIO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Não iniciada', date: '07/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'AGOSTO', daysToDelivery: 3, willRenew: '', notes: '', createdAt: '2026-05-01', updatedAt: '2026-05-04',
  },
  {
    id: '54', name: 'Nakal Olinda', entryMonth: 'MAIO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Não iniciada', date: '07/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'AGOSTO', daysToDelivery: 3, willRenew: '', notes: '', createdAt: '2026-05-01', updatedAt: '2026-05-04',
  },
  {
    id: '55', name: 'Dom Albert', entryMonth: 'MAIO', method: 'SABOR', consultant: '',
    stages: {
      e1: { status: 'Não iniciada', date: '07/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'AGOSTO', daysToDelivery: 3, willRenew: '', notes: '', createdAt: '2026-05-01', updatedAt: '2026-05-04',
  },
  // Extra clientes individuais
  {
    id: '56', name: 'Belisco\'s Café', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '57', name: 'Ruizito', entryMonth: 'MARÇO', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Em aprovação', date: '04/05/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/07/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-03-01', updatedAt: '2026-05-04',
  },
  {
    id: '58', name: 'Dudu Du Bom', entryMonth: 'ABRIL', method: 'SABOR', consultant: 'LUCAS',
    stages: {
      e1: { status: 'Em aprovação', date: '27/04/2026', receivedDate: '' },
      e2: { status: 'Não iniciada', date: '15/05/2026', receivedDate: '' },
      e3: { status: 'Não iniciada', date: '01/06/2026', receivedDate: '' },
      e4: { status: 'Não iniciada', date: '', receivedDate: '' },
    },
    completedStages: 0, receivedAmount: 0, pendingAmount: 8100,
    renewalMonth: 'JULHO', daysToDelivery: 0, willRenew: 'SIM', notes: '', createdAt: '2026-04-01', updatedAt: '2026-05-04',
  },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'lucas', name: 'Lucas', role: 'Coordenador', type: 'consultor',
    portfolioClientIds: ['1', '2', '3', '4', '24', '25', '26', '31', '36', '43', '45', '48', '56', '57', '58'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'rodrigo', name: 'Rodrigo', role: 'Coordenador', type: 'consultor',
    portfolioClientIds: ['5', '6', '7', '8', '9', '13', '16', '17', '18', '19', '20', '21', '22', '23', '27', '35', '41', '46', '51'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'alvaro', name: 'Álvaro', role: 'Social Mídia', type: 'social-media',
    portfolioClientIds: ['5', '6', '7', '8', '9', '13', '20', '21', '22', '46'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'anthony', name: 'Anthony', role: 'Social Mídia', type: 'social-media',
    portfolioClientIds: ['2', '3', '4'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'gabriel', name: 'Gabriel', role: 'Social Mídia', type: 'social-media',
    portfolioClientIds: ['1', '24', '25', '26', '31', '36', '43', '45', '48', '56', '57', '58'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'vitor', name: 'Vitor', role: 'Social Mídia', type: 'social-media',
    portfolioClientIds: ['16', '17', '18', '19', '23', '27', '35', '41', '51'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'vinicius', name: 'Vinicius', role: 'Filmmaker', type: 'filmmaker',
    portfolioClientIds: ['14', '16', '17', '18', '19', '37', '38', '39', '40', '41', '42'],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'rostand', name: 'Rostand', role: 'Gestor de Tráfego', type: 'filmmaker',
    portfolioClientIds: [],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'luan', name: 'Luan', role: 'Gestor de Tráfego', type: 'filmmaker',
    portfolioClientIds: [],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'henrrique', name: 'Henrrique', role: 'Gestor de Tráfego', type: 'filmmaker',
    portfolioClientIds: [],
    active: true, createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'rafael', name: 'Rafael', role: 'Designer', type: 'designer',
    portfolioClientIds: [],
    active: true,
    referrals: [
      { id: 'ref-5', clientName: 'Studio Fit Pilates', month: 'MAIO/2026' },
    ],
    createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'daniel', name: 'Daniel', role: 'Designer', type: 'designer',
    portfolioClientIds: [],
    active: true,
    referrals: [],
    createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'guilherme', name: 'Guilherme', role: 'Designer', type: 'designer',
    portfolioClientIds: [],
    active: true,
    referrals: [
      { id: 'ref-6', clientName: 'Academia Força Total', month: 'JUNHO/2026' },
    ],
    createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
  {
    id: 'diego', name: 'Diego', role: 'Designer', type: 'designer',
    portfolioClientIds: [],
    active: true,
    referrals: [],
    createdAt: '2026-01-01', updatedAt: '2026-05-04',
  },
];

export const MOCK_DASHBOARD: DashboardData = {
  portfolioTotal: 505800,
  alreadyReceived: 220650,
  stillToReceive: 262275,
  activeClients: 53,
  methods: [
    { id: 'sabor', name: 'SABOR', totalClients: 33, receivedAmount: 133650, pendingAmount: 133650, clientPercentage: 57.9, revenuePercentage: 60.6 },
    { id: 'clinica360', name: 'CLÍNICA 360', totalClients: 21, receivedAmount: 84000, pendingAmount: 118125, clientPercentage: 36.8, revenuePercentage: 38.1 },
    { id: 'clinica180', name: 'CLÍNICA 180', totalClients: 3, receivedAmount: 3000, pendingAmount: 10500, clientPercentage: 5.3, revenuePercentage: 1.4 },
  ],
  monthlyForecast: [
    { month: 'Abril/2026', lucas: 6075, rodrigo: 15150, total: 21225 },
    { month: 'Maio/2026', lucas: 18825, rodrigo: 38400, total: 57225 },
    { month: 'Junho/2026', lucas: 16800, rodrigo: 19800, total: 36600 },
    { month: 'Julho/2026', lucas: 10725, rodrigo: 9900, total: 20625 },
    { month: 'Agosto/2026', lucas: 0, rodrigo: 0, total: 0 },
    { month: 'Setembro/2026', lucas: 0, rodrigo: 0, total: 0 },
  ],
  consultantReceived: [
    { name: 'Lucas', received: 47175 },
    { name: 'Rodrigo', received: 110400 },
  ],
  clientsByStage: [
    { stage: 'Etapa 1', description: 'E1 em andamento', count: 14 },
    { stage: 'Etapa 2', description: 'E1 aprovada/concluída, E2 pendente', count: 14 },
    { stage: 'Etapa 3', description: 'E2 aprovada/concluída, E3 pendente', count: 3 },
    { stage: 'Etapa 4', description: 'E3 aprovada/concluída, E4 pendente', count: 12 },
    { stage: 'Concluído', description: 'Todas as entregas concluídas', count: 10 },
    { stage: 'Cancelado', description: 'Contrato cancelado', count: 4 },
  ],
};
