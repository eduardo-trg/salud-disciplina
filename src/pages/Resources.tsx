import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';

type Resource = {
  id: string;
  category: 'Fundamentos' | 'Disciplina' | 'Antojos' | 'Lectura' | 'Planificación' | 'Progreso';
  title: string;
  icon: string;
  text: string;
  action: string;
};

const RESOURCES: Resource[] = [
  { id: '1', category: 'Fundamentos', title: '¿Qué es realmente Low-Carb?', icon: '🌿', text: 'No es dejar de comer. Es cambiar la fuente de energía: de azúcar a grasas y proteínas. Resultado: menos picos de insulina, más saciedad y energía estable.', action: 'Revisa tu último registro: ¿cuántos alimentos ultraprocesados eliminaste esta semana?' },
  { id: '2', category: 'Disciplina', title: 'Motivación vs. Disciplina', icon: '🧠', text: 'La motivación te hace empezar. La disciplina te hace continuar cuando no tienes ganas. No esperes "sentirte listo". Actúa primero, la energía llega después.', action: 'Hoy, registra solo 1 hábito pequeño. Mañana, suma otro.' },
  { id: '3', category: 'Antojos', title: 'Cómo manejar el antojo de las 3 PM', icon: '⚡', text: 'El antojo no es falta de fuerza de voluntad. Suele ser deshidratación, falta de proteína en el desayuno o estrés. Bebe agua primero, espera 10 minutos.', action: 'Prepara un snack saciante: 10 almendras + 1 cubo de queso o 1/2 aguacate con sal.' },
  { id: '4', category: 'Lectura', title: 'Etiquetas que engañan', icon: '🏷️', text: '"Bajo en grasa" casi siempre significa "alto en azúcar". "Sin gluten" no es sinónimo de saludable. Mira siempre la lista de ingredientes: si no lo pronuncias, no lo comas.', action: 'Revisa 1 producto en tu alacena. ¿Tiene más de 5 ingredientes? Busca un reemplazo simple.' },
  { id: '5', category: 'Planificación', title: 'Meal Prep en 15 minutos', icon: '⏱️', text: 'No necesitas cocinar 2 horas. Hierve huevos, asa pollo en bandeja, lava espinacas y corta aguacate. Ten listos los componentes, no platos terminados.', action: 'El domingo, dedica 15 min a preparar 3 proteínas y 2 verduras base.' },
  { id: '6', category: 'Progreso', title: 'La regla de los 2 días', icon: '📈', text: 'Nunca falles 2 días seguidos. Un día "malo" es humano. Dos días son el inicio de un patrón. La constancia le gana a la perfección cada vez.', action: 'Si ayer no registraste, hoy abre la app y anota solo tu energía. Rompe la racha.' }
];

const CATEGORIES = ['Todos', 'Fundamentos', 'Disciplina', 'Antojos', 'Lectura', 'Planificación', 'Progreso'] as const;

export default function Resources() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<typeof CATEGORIES[number]>('Todos');

  // 🔍 Detectar si es invitado
  const isGuest = !auth.currentUser || auth.currentUser.isAnonymous;

  const filtered = RESOURCES.filter(r => {
    const matchesCategory = filter === 'Todos' || r.category === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || r.action.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">📚 Aprende Low-Carb</h1>
          <p className="text-gray-600 text-sm">Guías rápidas, ciencia simple y acciones concretas. Sin teoría innecesaria.</p>
        </header>

        {/* 👋 Banner para invitados (conversión suave) */}
        {isGuest && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-blue-800 font-medium">👋 Estás explorando como invitado</p>
            <p className="text-xs text-blue-700 mt-1">Crea una cuenta gratis para guardar tu progreso y acceder a todas las herramientas.</p>
            <button 
              onClick={() => navigate('/auth')} 
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg transition-all active:scale-[0.98]"
            >
              Crear cuenta gratis
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Buscar tema o acción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 mb-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${filter === cat ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map(r => (
            <article key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{r.title}</h3>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{r.category}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{r.text}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-medium text-green-800">✅ Acción hoy:</p>
                <p className="text-sm text-green-900 mt-1">{r.action}</p>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">No se encontraron recursos con esa búsqueda.</div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}