export type StageStatus =
  | 'Não iniciada'
  | 'Em execução'
  | 'Em aprovação'
  | 'Concluído'
  | 'Cancelado';

export type RenewalStatus = 'SIM' | 'NÃO' | 'TALVEZ' | '';

export type Method = 'SABOR' | 'CLÍNICA 360' | 'CLÍNICA 180';

export type EntryMonth =
  | 'JANEIRO'
  | 'FEVEREIRO'
  | 'MARÇO'
  | 'ABRIL'
  | 'MAIO'
  | 'JUNHO'
  | 'JULHO'
  | 'AGOSTO'
  | 'SETEMBRO'
  | 'OUTUBRO'
  | 'NOVEMBRO'
  | 'DEZEMBRO';

export type ConsultantName = 'LUCAS' | 'RODRIGO' | '';

export type ClientStage = {
  status: StageStatus;
  date: string;
  receivedDate: string;
};

export type ClientStages = {
  e1: ClientStage;
  e2: ClientStage;
  e3: ClientStage;
  e4: ClientStage;
};

export type ProfessionalType = 'consultor' | 'social-media' | 'designer' | 'filmmaker';

export type Referral = {
  id: string;
  clientName: string;
  month: string; // 'MAIO/2026'
};

export type Client = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  entryMonth: EntryMonth;
  method: Method;
  consultant: ConsultantName;
  socialMedia?: string;
  designer?: string;
  stages: ClientStages;
  completedStages: number;
  receivedAmount: number;
  pendingAmount: number;
  renewalMonth: string;
  daysToDelivery: number;
  willRenew: RenewalStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Professional = {
  id: string;
  name: string;
  role: string;
  type: ProfessionalType;
  portfolioClientIds: string[];
  active: boolean;
  referrals?: Referral[];
  createdAt: string;
  updatedAt: string;
};

export type MethodData = {
  id: string;
  name: Method;
  totalClients: number;
  receivedAmount: number;
  pendingAmount: number;
  clientPercentage: number;
  revenuePercentage: number;
};

export type MonthlyForecast = {
  month: string;
  lucas: number;
  rodrigo: number;
  total: number;
};

export type ConsultantReceived = {
  name: string;
  received: number;
};

export type StageCount = {
  stage: string;
  description: string;
  count: number;
};

export type DashboardData = {
  portfolioTotal: number;
  alreadyReceived: number;
  stillToReceive: number;
  activeClients: number;
  methods: MethodData[];
  monthlyForecast: MonthlyForecast[];
  consultantReceived: ConsultantReceived[];
  clientsByStage: StageCount[];
};

export type DailySummary = {
  overdueClients: Client[];
  weeklyDeliveries: Client[];
  upcomingRenewals: Client[];
  waitingApproval: Client[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'consultant' | 'viewer';
  permissions: string[];
  createdAt: string;
};

export type ReportFilter = {
  period?: { start: string; end: string };
  consultant?: ConsultantName;
  method?: Method;
  clientId?: string;
  stageStatus?: StageStatus;
  entryMonth?: EntryMonth;
  renewalMonth?: string;
  renewalStatus?: RenewalStatus;
};

export type FilterState = {
  search: string;
  consultant: string;
  method: string;
  entryMonth: string;
  renewalMonth: string;
  stageStatus: string;
  willRenew: string;
  overdue: boolean;
};
