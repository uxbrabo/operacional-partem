import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const USE_MOCK_AUTH = true;

const MOCK_USER = {
  uid: 'mock-uid-001',
  email: 'admin@partem.com.br',
  displayName: 'Admin Partem',
};

export async function signIn(email: string, password: string): Promise<FirebaseUser | null> {
  if (USE_MOCK_AUTH) {
    if (email === 'admin@partem.com.br' && password === 'partem2026') {
      return MOCK_USER as unknown as FirebaseUser;
    }
    throw new Error('E-mail ou senha incorretos.');
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  if (USE_MOCK_AUTH) return;
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  if (USE_MOCK_AUTH) return;
  await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  if (USE_MOCK_AUTH) {
    const stored = sessionStorage.getItem('partem_mock_user');
    callback(stored ? (JSON.parse(stored) as FirebaseUser) : null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
