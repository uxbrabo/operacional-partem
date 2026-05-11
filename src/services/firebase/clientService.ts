import type { Client } from '../../types';
import { MOCK_CLIENTS } from '../../data/mockData';

const USE_MOCK = true;

export async function getClients(): Promise<Client[]> {
  if (USE_MOCK) {
    await delay(300);
    return [...MOCK_CLIENTS];
  }
  // Firestore implementation:
  // const snap = await getDocs(collection(db, 'clients'));
  // return snap.docs.map(d => ({ id: d.id, ...d.data() } as Client));
  return [];
}

export async function getClientById(id: string): Promise<Client | null> {
  if (USE_MOCK) {
    await delay(200);
    return MOCK_CLIENTS.find((c) => c.id === id) ?? null;
  }
  return null;
}

export async function updateClient(id: string, data: Partial<Client>): Promise<void> {
  if (USE_MOCK) {
    await delay(300);
    const idx = MOCK_CLIENTS.findIndex((c) => c.id === id);
    if (idx !== -1) Object.assign(MOCK_CLIENTS[idx], data);
    return;
  }
  // Firestore: await updateDoc(doc(db, 'clients', id), data);
}

export async function createClient(data: Omit<Client, 'id'>): Promise<Client> {
  if (USE_MOCK) {
    await delay(300);
    const newClient = { ...data, id: String(Date.now()) };
    MOCK_CLIENTS.push(newClient);
    return newClient;
  }
  return data as Client;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
