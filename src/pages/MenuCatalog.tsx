import { useState } from 'react';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useUserTrack } from '../hooks/useUserTrack';
import { MENU_ITEMS } from '../lib/menuData';

// Tipo local para evitar conflictos de importación
type MenuItem = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  prepTime: number;
  description: string;
  macros?: { protein: string; fat: string; carbs: string };
  bestFor: string[];
};

export default function MenuCatalog() {
  const { saveLog } = useFirebaseSync();
  const { profile } = useUserTrack();
  const [filter, setFilter] = useState<'todos' | 'proteína' | 'vegetariano' | 'rápido'>('todos');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const filtered = MENU_ITEMS.filter((item: MenuItem) => {
    const matchesFilter = filter === 'todos' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const isBestForTrack = profile ? item.bestFor.includes(profile.track) : true;
    return matchesFilter && matchesSearch && (isBestForTrack || filter !== 'todos');
  }).sort((a: MenuItem, b: MenuItem) => {
    if (profile && a.bestFor.includes(profile.track) && !b.bestFor.includes(profile.track)) return -1;
    if (profile && !a.bestFor.includes(profile.track) && b.bestFor.includes(profile.track)) return 1;
    return 0;
  });

  const handleAddToToday = async (item: MenuItem) => {
    setFeedback(`✅ Añadido a tu día`);
    setTimeout(() => setFeedback(null), 2000);
    
    await saveLog({
      date: today,
      meals: { comida: [{ group: 'Proteínas', subgroup: 'Plato sugerido', food: item.name, portion: 'mediana' }] }
    });
  };

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">🍽️ Catálogo Low-Carb</h1>
          <p className="text-gray-600 text-sm">Ideas listas para registrar. Prioriza los que mejor se ajustan a tu enfoque.</p>
        </header>

        {feedback && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm z-50">
            {feedback}
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {(['todos', 'proteína', 'vegetariano', 'rápido'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {f === 'todos' ? '🌐 Todos' : f === 'proteína' ? '🥩 Proteína' : f === 'vegetariano' ? '🌱 Vegetariano' : '⚡ Rápido (<15m)'}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Buscar plato o ingrediente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />

        <div className="grid gap-4">
          {filtered.map((item: MenuItem) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">⏱️ {item.prepTime}m</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map(tag => <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{tag}</span>)}
                {item.macros && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                    P: {item.macros.protein} • G: {item.macros.fat} • C: {item.macros.carbs}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleAddToToday(item)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-all active:scale-[0.98]"
              >
                + Añadir a mi día de hoy
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">No se encontraron platos con esos filtros.</div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}