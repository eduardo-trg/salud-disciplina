import { useNavigate } from 'react-router-dom';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';
import { useDailyLogs } from '../hooks/useDailyLogs';
import type { DailyLog } from '../types';

export default function TrackDashboard() {
  const navigate = useNavigate();
  const { logs, loading, error } = useDailyLogs(7);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando tu tablero...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Cálculos seguros con tipos explícitos
  const daysLogged = logs.length;
  const totalMeals = logs.reduce((sum: number, log: DailyLog) => 
    sum + (log.meals ? Object.values(log.meals).flat().length : 0), 0);
  
  const avgEnergy = daysLogged > 0
    ? (logs.reduce((sum: number, log: DailyLog) => sum + (log.wellness?.energy || 0), 0) / daysLogged).toFixed(1)
    : '0.0';
    
  const totalActivityMinutes = logs.reduce((sum: number, log: DailyLog) => 
    sum + (log.activities || []).reduce((a: number, act: { minutes?: number }) => a + (act.minutes || 0), 0), 0);

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tu Espacio Low-Carb</h1>
            <p className="text-gray-600">Resumen de los últimos {daysLogged} días</p>
          </div>
          <button 
            onClick={() => navigate('/log')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Registrar día
          </button>
        </header>

        {daysLogged === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <span className="text-4xl mb-3 block">🌿</span>
            <h2 className="text-xl font-semibold mb-2">Comienza tu registro</h2>
            <p className="text-gray-600 mb-4">Aún no hay datos registrados. ¡Tu primer día es el más importante!</p>
            <button
              onClick={() => navigate('/log')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Registrar mi primer día
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-green-600">{daysLogged}</p>
                <p className="text-sm text-gray-500">Días registrados</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-blue-600">{totalMeals}</p>
                <p className="text-sm text-gray-500">Comidas totales</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-purple-600">{avgEnergy}</p>
                <p className="text-sm text-gray-500">Energía promedio</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-3xl font-bold text-orange-600">{totalActivityMinutes}</p>
                <p className="text-sm text-gray-500">Min. actividad</p>
              </div>
            </div>

            <section>
              <h2 className="text-lg font-semibold mb-3">Actividad Reciente</h2>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => {
                  const mealCount = log.meals ? Object.values(log.meals).flat().length : 0;
                  const dateStr = new Date(log.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
                  return (
                    <div key={log.id || log.date} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="font-medium capitalize">{dateStr}</p>
                        <p className="text-sm text-gray-500">{mealCount} comidas • ⚡ {log.wellness?.energy || '-'}/5</p>
                      </div>
                      <button
                        onClick={() => navigate(`/log?date=${log.date}`)}
                        className="text-blue-600 text-sm hover:underline font-medium"
                      >
                        Ver detalle →
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
