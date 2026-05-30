import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import type { DailyLog } from '../types';

export const useDailyLogs = (limitDays: number = 30) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const logsRef = collection(db, `users/${user.uid}/daily_logs`);
      const q = query(logsRef, orderBy('date', 'desc'), limit(limitDays));
      const snap = await getDocs(q);
      
      // Cast seguro: Firestore data + doc.id coincide ahora con DailyLog flexible
      const data = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) } as DailyLog));
      setLogs(data);
    } catch (err) {
      console.error('Error cargando logs:', err);
      setError('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  }, [user, limitDays]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
};
