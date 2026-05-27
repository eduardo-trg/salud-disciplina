import { useEffect } from 'react'; // ✅ Agrega esto si no está
import { useNavigate } from 'react-router-dom';
import { useUserTrack } from '../hooks/useUserTrack';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function TrackDashboard() {
  const navigate = useNavigate();
  const { profile, loading, startProgram, advanceToNextCycle, switchToMaintenance, getCurrentWeekData } = useUserTrack();
  const { logs } = useDailyLogs();

// En TrackDashboard.tsx, dentro del componente:
  useEffect(() => {
  // ✅ Solo redirigir si NO estamos en /recursos
  if (window.location.pathname !== '/recursos') {
    const hasSeen = localStorage.getItem('has-seen-welcome');
    if (!hasSeen) {
      navigate('/welcome', { replace: true });
    }
  }
}, [navigate]);

  if (loading || !profile) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Cargando tu espacio...</div>;
  }

  const track = profile.track;
  const daysLogged = logs.length;
  const currentWeekData = getCurrentWeekData();

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {track === 'explorer' && '🌿 Tu Espacio Low-Carb'}
              {track === 'program' && '🔄 Movimiento Consciente'}
              {track === 'bridal' && '💍 Preparación Especial'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {track === 'explorer' && 'Menú, registro y bienestar a tu ritmo.'}
              {track === 'program' && (profile.programStatus === 'active' 
                ? `Semana ${currentWeekData?.week || 1}/8 • ${daysLogged} días registrados` 
                : 'Programa de 8 semanas para retomar tu ritmo.')}
              {track === 'bridal' && (profile.bridalDeadline 
                ? `Faltan ${getDaysUntil(profile.bridalDeadline)} días • Membresía activa` 
                : 'Configura tu fecha en Ajustes')}
            </p>
          </div>
          <button onClick={() => navigate('/track')} className="text-xs text-blue-600 hover:underline whitespace-nowrap transition-colors">Cambiar enfoque</button>
        </header>

        <div className="space-y-4 mb-6">
          {track === 'program' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              {profile.programStatus === 'inactive' ? (
                <>
                  <h3 className="font-semibold mb-1">🔄 ¿Listo para comenzar?</h3>
                  <p className="text-sm text-blue-800 mb-3">8 semanas de rutinas suaves, registro consciente y hábitos sostenibles.</p>
                  <button 
                    onClick={startProgram} 
                    className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-100 active:scale-[0.98]"
                  >
                    Iniciar Programa
                  </button>
                </>
              ) : profile.programStatus === 'completed' ? (
                <>
                  <h3 className="font-semibold mb-1">🎉 ¡Ciclo completado!</h3>
                  <p className="text-sm text-blue-800 mb-3">Has construido una nueva línea base. ¿Qué sigue?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={advanceToNextCycle} 
                      className="flex-1 bg-blue-600 text-white text-xs px-2 py-1.5 rounded hover:bg-blue-700 transition-all active:scale-[0.98]"
                    >
                      Ciclo 2
                    </button>
                    <button 
                      onClick={switchToMaintenance} 
                      className="flex-1 bg-gray-200 text-gray-800 text-xs px-2 py-1.5 rounded hover:bg-gray-300 transition-all active:scale-[0.98]"
                    >
                      Mantenimiento
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {currentWeekData ? (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">Semana {currentWeekData.week}/8</h3>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded capitalize">
                          {currentWeekData.routine.intensity}
                        </span>
                      </div>
                      <h4 className="font-medium text-blue-900 mb-1">{currentWeekData.title}</h4>
                      <p className="text-sm text-blue-800 mb-2">{currentWeekData.focus}</p>
                      <div className="text-xs text-blue-700 mb-3 space-y-1">
                        <p>⏱️ {currentWeekData.routine.duration} • 📅 {currentWeekData.routine.frequency}</p>
                        {currentWeekData.milestone && (
                          <p className="font-medium bg-blue-100 px-2 py-1 rounded mt-1">{currentWeekData.milestone}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => navigate('/log')} 
                        className="w-full bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-all duration-100 active:scale-[0.98] mb-2"
                      >
                        + Registrar día
                      </button>
                      <p className="text-xs text-blue-600 italic">💡 {currentWeekData.reminder}</p>
                    </>
                  ) : (
                    <p className="text-sm text-blue-800">Cargando tu semana actual...</p>
                  )}
                </>
              )}
            </div>
          )}

          {track === 'bridal' && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <h3 className="font-semibold mb-1">📸 Check-in semanal</h3>
              <p className="text-sm text-pink-800 mb-3">Peso en ayunas + métricas. Tu especialista revisa la tendencia, no el número exacto.</p>
              <button onClick={() => navigate('/log')} className="bg-pink-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-pink-700 transition-all duration-100 active:scale-[0.98]">+ Registrar métricas</button>
            </div>
          )}

          {track === 'explorer' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <h3 className="font-semibold mb-1">🍽️ Menú sugerido hoy</h3>
              <p className="text-sm text-green-800 mb-3">Consomé + Proteína magra + Verduras. Bajo impacto, alta saciedad.</p>
              <button onClick={() => navigate('/log')} className="bg-green-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-100 active:scale-[0.98]">+ Registrar alimentos</button>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
          <h2 className="font-semibold mb-2">📊 Tu avance reciente</h2>
          <p className="text-sm text-gray-600">
            {daysLogged > 0 ? `Has registrado ${daysLogged} día${daysLogged > 1 ? 's' : ''}. La constancia está construyendo tu nueva línea base.` : 'Comienza tu primer registro para activar tu historial.'}
          </p>
          <button onClick={() => navigate('/progreso')} className="mt-3 text-sm text-blue-600 hover:underline transition-colors">Ver historial completo →</button>
        </div>

        <div className="bg-gray-100 rounded-xl p-3 text-center text-xs text-gray-600 transition-all duration-200 hover:bg-gray-200">
          {track === 'program' && '💡 No necesitas ser perfecto. Solo necesitas ser consistente.'}
          {track === 'bridal' && '💡 El peso fluctúa. La tendencia de 2 semanas sí importa.'}
          {track === 'explorer' && '💡 Low-Carb no es restricción. Es elegir mejor combustible.'}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}