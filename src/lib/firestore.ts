import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { DailyLog } from '../types';

const getLogRef = (userId: string, date: string) => 
  doc(db, `users/${userId}/daily_logs`, date);

// ✅ Guardar o fusionar log del día (merge seguro)
export const saveDailyLog = async (userId: string, date: string, data: Partial<DailyLog>) => {
  const ref = getLogRef(userId, date);
  await setDoc(ref, { ...data, date, updatedAt: new Date().toISOString() }, { merge: true });
};

// ✅ Obtener un día específico
export const getDailyLog = async (userId: string, date: string): Promise<DailyLog | null> => {
  const ref = getLogRef(userId, date);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } as DailyLog : null;
};

// ✅ Obtener historial ordenado
export const getDailyLogsHistory = async (userId: string, limitDays: number = 30): Promise<DailyLog[]> => {
  const logsRef = collection(db, `users/${userId}/daily_logs`);
  const q = query(logsRef, orderBy('date', 'desc'), limit(limitDays));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyLog));
};