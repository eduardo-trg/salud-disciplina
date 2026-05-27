import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { MealItem, DrinkItem } from '../lib/offlineStorage';

export interface DailyLog {
  id: string;
  date: string;
  sleep: { hours: number; quality: 1 | 2 | 3 | 4 | 5 };
  meals: Record<string, MealItem[]>;
  drinks: DrinkItem[];
  activities: { type: string; minutes: number }[];
  wellness: { energy: number; satiety: number; sleep: number };
  metrics?: { // ✅ NUEVO
    weight?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    glucose?: number;
    note?: string;
  };
}

export function useDailyLogs() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const userId = auth.currentUser?.uid || 'temp-user';
        const colRef = collection(db, `users/${userId}/daily_logs`);
        const querySnapshot = await getDocs(colRef);
        const fetchedLogs: DailyLog[] = [];
        querySnapshot.forEach((d) => fetchedLogs.push({ id: d.id, ...d.data() } as DailyLog));
        const sorted = fetchedLogs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
        setLogs(sorted);
      } catch (error) { console.error('Error al obtener logs:', error); } 
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  return { logs, loading };
}