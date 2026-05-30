import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { saveOffline, getPendingLogs, markAsSynced, onOnline, isOnline } from '../lib/offlineStorage';

export function useFirebaseSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const userId = auth.currentUser?.uid || 'temp-user';

  useEffect(() => { setPendingCount(getPendingLogs().length); }, []);
  
  useEffect(() => {
    const unsub = onOnline(async () => {
      if (isOnline()) await syncPendingLogs();
    });
    return unsub;
  }, []);

  const saveLog = async (logData: any) => {
    setIsLoading(true); setError(null);
    const path = `users/${userId}/daily_logs/${logData.date}`;
    
    try {
      if (isOnline()) {
        await setDoc(doc(db, path), { ...logData, updatedAt: serverTimestamp() }, { merge: true });
        return true;
      } else {
        saveOffline(logData);
        setPendingCount(getPendingLogs().length);
        return true;
      }
    } catch (err: any) {
      console.warn('⚠️ Error Firestore:', err.message);
      saveOffline(logData);
      setPendingCount(getPendingLogs().length);
      setError('Sin conexión. Guardado local.');
      return true;
    } finally { setIsLoading(false); }
  };

  const syncPendingLogs = async () => {
    const pending = getPendingLogs();
    if (!pending.length) return;
    for (const log of pending) {
      try {
        await setDoc(doc(db, `users/${userId}/daily_logs/${log.date}`), {
          ...log, updatedAt: serverTimestamp()
        });
        markAsSynced(log.id);
      } catch (e) { console.error(e); }
    }
    setPendingCount(getPendingLogs().length);
  };

  return { saveLog, isLoading, error, pendingCount, syncPendingLogs };
}
