import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';
import { generateReport, copyToClipboard } from '../lib/generateReport';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Tipado seguro para los registros de Firestore
interface LogData {
  id: string;
  date: string;
  activities?: { minutes?: number }[];
  wellness?: { energy?: number };
  meals?: Record<string, unknown[]>;
  sleep?: { hours?: number };
  drinks?: unknown[];
  metrics?: { weight?: number; glucose?: number; bpSystolic?: number; bpDiastolic?: number; note?: string };
}

export default function Progress() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogData[]>([]);
  const [reportRange, setReportRange] = useState<7 | 30>(7);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoadingProgress(true);
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        const logsRef = collection(db, `users/${userId}/daily_logs`);
        const q = query(logsRef, orderBy('date', 'desc'), limit(60));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogData));
        setLogs(data);
      } catch (e) {
        console.error('Error cargando progreso:', e);
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchLogs();
  }, []);

  const handleExport = async () => {
    const reportText = generateReport(logs as any[], 'Usuario Registrado', reportRange);
    try {
      await copyToClipboard(reportText);
      alert(`✅ Reporte de últimos ${reportRange} días copiado.\nPégalo en WhatsApp, email o tu documento.`);
    } catch {
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-salud-${reportRange}d-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loadingProgress) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Cargando tu progreso...</p></div>;
  if (logs.length === 0) return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900 flex flex-col items-center justify-center px-4 text-center">
      <ConnectionStatus />
      <span className="text-4xl mb-4">📊</span>
      <h1 className="text-2xl font-bold mb-2">Aún no hay registros</h1>
      <p className="text-gray-600 mb-6">Comienza a registrar tu día para ver tu evolución.</p>
      <BottomNav />
    </div>
  );

  const totalMinutes = logs.reduce((sum: number, log: LogData) => 
    sum + (log.activities || []).reduce((a: number, act: { minutes?: number }) => a + (act.minutes || 0), 0), 0);
    
  const avgEnergy = logs.length > 0 
    ? (logs.reduce((sum: number, log: LogData) => sum + (log.wellness?.energy || 0), 0) / logs.length).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tu progreso</h1>
            <p className="text-gray-600">Últimos {logs.length} días registrados</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
            ← Volver
          </button>
        </header>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 transition-all duration-200">
          <p className="text-sm font-medium text-blue-800 mb-2">📄 Generar reporte de:</p>
          <div className="flex gap-2">
            <button onClick={() => setReportRange(7)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98] ${reportRange === 7 ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}>
              Últimos 7 días
            </button>
            <button onClick={() => setReportRange(30)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98] ${reportRange === 30 ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}>
              Últimos 30 días
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <p className="text-3xl font-bold text-green-600">{totalMinutes}</p>
            <p className="text-sm text-gray-500">Min. actividad total</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <p className="text-3xl font-bold text-purple-600">{avgEnergy}</p>
            <p className="text-sm text-gray-500">Energía promedio</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {logs.slice(0, 7).map((log: LogData) => {
            const dayMinutes = (log.activities || []).reduce((sum: number, a: { minutes?: number }) => sum + (a.minutes || 0), 0);
            const mealCount = Object.values(log.meals || {}).flat().length;
            const sleepHours = log.sleep?.hours || 0;
            const drinkCount = (log.drinks || []).length;
            const dateStr = new Date(log.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
            const m = log.metrics;

            return (
              <div key={log.id || log.date} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg capitalize">{dateStr}</span>
                  <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">⚡ {log.wellness?.energy}/5</span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>🍽️ {mealCount} alimentos</span>
                  <span>🏃 {dayMinutes} min</span>
                  {sleepHours > 0 && <span>😴 {sleepHours}h</span>}
                  {drinkCount > 0 && <span>🥤 {drinkCount} bebidas</span>}
                </div>
                {(m?.weight || m?.glucose || m?.bpSystolic) && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {m.weight && <span>⚖️ {m.weight} kg</span>}
                    {m.glucose && <span>🔹 {m.glucose} mg/dL</span>}
                    {m.bpSystolic && m.bpDiastolic && <span>🩸 {m.bpSystolic}/{m.bpDiastolic}</span>}
                    {m.note && <span className="italic truncate max-w-[200px]">"{m.note}"</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={handleExport} disabled={logs.length === 0} className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-gray-400">
          📄 Copiar reporte ({reportRange} días)
        </button>

        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 transition-all duration-200 hover:bg-green-100">
          <p className="text-sm text-green-800">💡 <strong>Recuerda:</strong> La constancia supera a la perfección. Un día "regular" sigue sumando a tu tendencia general.</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
