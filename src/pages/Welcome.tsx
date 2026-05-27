import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('has-seen-welcome');
    if (hasSeen) {
      navigate('/track', { replace: true }); // ✅ También aquí
    } else {
      setTimeout(() => setVisible(true), 100);
    }
  }, [navigate]);

  const handleStart = () => {
    localStorage.setItem('has-seen-welcome', 'true');
    navigate('/track', { replace: true }); // replace evita volver a la bienvenida con el botón "atrás"
  };

  if (!visible) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6 transition-opacity duration-700">
      <div className="max-w-md text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Tu ritmo. Tu cuerpo.<br />Sin prisa, sin presión.
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Más que una app, es tu compañero para construir hábitos que se sientan bien por dentro y se reflejen por fuera.
          </p>
        </div>

        <div className="space-y-4 text-left bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌿</span>
            <p className="text-sm text-gray-700"><strong>Movimiento suave:</strong> Diseñado para retomar sin dolor, sin exigencia extrema.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🍽️</span>
            <p className="text-sm text-gray-700"><strong>Alimentación consciente:</strong> Prioriza proteína y grasas buenas para recuperar tu energía.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <p className="text-sm text-gray-700"><strong>Registro claro:</strong> Observa tu progreso y compártelo con tu profesional de confianza.</p>
          </div>
        </div>

        <p className="text-gray-500 text-sm italic">
          No se trata de cambiar en dos semanas. Se trata de volver a confiar en ti.
        </p>

        <button
          onClick={handleStart}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 active:scale-[0.98] text-lg"
        >
          Comenzar mi camino
        </button>

        <p className="text-xs text-gray-400 mt-2">
          Puedes usarla gratis como invitado o crear una cuenta para sincronizar tu progreso.
        </p>
      </div>
    </div>
  );
}