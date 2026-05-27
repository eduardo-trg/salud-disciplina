import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserTrack } from '../hooks/useUserTrack';
import type { UserTrack } from '../types/user';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';

const TRACKS: { id: UserTrack; icon: string; title: string; desc: string; tag?: string }[] = [
  { id: 'explorer', icon: '🌿', title: 'Menú y Registro', desc: 'Accede al catálogo Low-Carb y lleva tu control a tu ritmo.' },
  { id: 'program', icon: '🔄', title: 'Programa 8 Semanas', desc: 'Rutinas de bajo impacto, seguimiento y hábitos sostenibles.', tag: 'Recomendado' },
  { id: 'bridal', icon: '💍', title: 'Fecha Límite', desc: 'Plan estructurado con membresía, métricas y entrenamiento a distancia.' }
];

export default function TrackSelector() {
  const navigate = useNavigate();
  const { setTrack, loading } = useUserTrack();
  const [selected, setSelected] = useState<UserTrack | null>(null);

  const handleSelect = async (track: UserTrack) => {
    setSelected(track);
    await setTrack(track);
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Cargando configuración...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">¿Qué buscas hoy?</h1>
          <p className="text-gray-600">Elige tu enfoque. Siempre puedes cambiarlo después en Ajustes.</p>
        </header>

        <div className="space-y-4 mb-6">
          {TRACKS.map(track => (
            <button
              key={track.id}
              onClick={() => handleSelect(track.id)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selected === track.id ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'} ${selected && selected !== track.id ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{track.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-lg">{track.title}</h2>
                    {track.tag && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{track.tag}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{track.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm">
          Prefiero explorar sin elegir aún →
        </button>
      </main>
      <BottomNav />
    </div>
  );
}