import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Client, Professional } from '../types';
import { MOCK_CLIENTS, MOCK_PROFESSIONALS } from '../data/mockData';

// Default assignments applied at init (can be overridden per client via edit)
const SM_ASSIGNMENTS: Record<string, string> = {
  '1': 'Gabriel', '24': 'Gabriel', '25': 'Gabriel', '26': 'Gabriel', '31': 'Gabriel',
  '36': 'Gabriel', '43': 'Gabriel', '45': 'Gabriel', '48': 'Gabriel', '56': 'Gabriel',
  '57': 'Gabriel', '58': 'Gabriel',
  '2': 'Anthony', '3': 'Anthony', '4': 'Anthony',
  '5': 'Álvaro', '6': 'Álvaro', '7': 'Álvaro', '8': 'Álvaro', '9': 'Álvaro',
  '13': 'Álvaro', '20': 'Álvaro', '21': 'Álvaro', '22': 'Álvaro', '46': 'Álvaro',
  '16': 'Vitor', '17': 'Vitor', '18': 'Vitor', '19': 'Vitor', '23': 'Vitor',
  '27': 'Vitor', '35': 'Vitor', '41': 'Vitor', '51': 'Vitor',
};

const DESIGNER_ASSIGNMENTS: Record<string, string> = {
  '10': 'Rafael', '11': 'Rafael', '12': 'Rafael', '13': 'Rafael', '15': 'Rafael',
  '21': 'Rafael', '22': 'Rafael',
  '28': 'Daniel', '29': 'Daniel', '30': 'Daniel', '32': 'Daniel', '33': 'Daniel',
  '34': 'Daniel', '44': 'Daniel',
  '37': 'Guilherme', '38': 'Guilherme', '39': 'Guilherme', '40': 'Guilherme',
  '41': 'Guilherme', '42': 'Guilherme', '47': 'Guilherme',
  '43': 'Diego', '45': 'Diego', '49': 'Diego', '50': 'Diego', '52': 'Diego',
  '53': 'Diego', '55': 'Diego',
};

function applyAssignments(clients: Client[]): Client[] {
  return clients.map((c) => ({
    ...c,
    socialMedia: c.socialMedia ?? SM_ASSIGNMENTS[c.id],
    designer: c.designer ?? DESIGNER_ASSIGNMENTS[c.id],
  }));
}

type DataContextValue = {
  clients: Client[];
  professionals: Professional[];
  addClient: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProfessional: (data: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>) => Professional;
  updateProfessional: (id: string, data: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  getClientsForProfessional: (prof: Professional) => Client[];
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() => applyAssignments(MOCK_CLIENTS));
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);

  function addClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const now = new Date().toISOString().slice(0, 10);
    const newClient: Client = { ...data, id: `c_${Date.now()}`, createdAt: now, updatedAt: now };
    setClients((prev) => [...prev, newClient]);
    return newClient;
  }

  function updateClient(id: string, data: Partial<Client>) {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : c,
      ),
    );
  }

  function deleteClient(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function addProfessional(data: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>): Professional {
    const now = new Date().toISOString().slice(0, 10);
    const id = `${data.name.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}`;
    const newProf: Professional = { ...data, id, createdAt: now, updatedAt: now };
    setProfessionals((prev) => [...prev, newProf]);
    return newProf;
  }

  function updateProfessional(id: string, data: Partial<Professional>) {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : p,
      ),
    );
  }

  function deleteProfessional(id: string) {
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
  }

  const getClientsForProfessional = useCallback(
    (prof: Professional): Client[] => {
      switch (prof.type) {
        case 'consultor':
          return clients.filter(
            (c) => c.consultant.toUpperCase() === prof.name.toUpperCase(),
          );
        case 'social-media':
          return clients.filter((c) => c.socialMedia === prof.name);
        case 'designer':
          return clients.filter((c) => c.designer === prof.name);
        case 'filmmaker':
          return clients.filter((c) => prof.portfolioClientIds.includes(c.id));
        default:
          return [];
      }
    },
    [clients],
  );

  return (
    <DataContext.Provider
      value={{
        clients,
        professionals,
        addClient,
        updateClient,
        deleteClient,
        addProfessional,
        updateProfessional,
        deleteProfessional,
        getClientsForProfessional,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
