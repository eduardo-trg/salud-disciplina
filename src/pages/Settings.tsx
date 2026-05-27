import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useUserTrack } from '../hooks/useUserTrack';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { BottomNav } from '../components/BottomNav';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, loading, updateProfile } = useUserTrack();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // 🔍 Detectar método de autenticación actual
  const [authInfo, setAuthInfo] = useState<{ label: string; color: string }>({ label: 'Cargando...', color: 'gray' });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return setAuthInfo({ label: 'Desconectado', color: 'red' });
    
    if (user.isAnonymous) {
      setAuthInfo({ label: '🟡 Invitado (datos solo en este dispositivo)', color: 'yellow' });
    } else {
      const provider = user.providerData[0]?.providerId;
      if (provider === 'google.com') {
        setAuthInfo({ label: `🔵 Google (${user.email})`, color: 'blue' });
      } else if (provider === 'password') {
        setAuthInfo({ label: `🟢 Correo (${user.email})`, color: 'green' });
      } else {
        setAuthInfo({ label: `Autenticado (${user.email || 'ID interno'})`, color: 'gray' });
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth', { replace: true });
    } catch {
      setMessage({ type: 'error', text: 'No se pudo cerrar sesión.' });
    }
  };

  const handleResetApp = () => {
    if (confirm('¿Reiniciar app para pruebas? Se borrarán registros locales y la bienvenida. Tus datos en la nube permanecerán seguros.')) {
      localStorage.removeItem('has-seen-welcome');
      localStorage.removeItem('salud-disciplina:pending-logs');
      window.location.reload();
    }
  };

  if (loading || !profile) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Cargando ajustes...</div>;
  }

  const trackLabels: Record<string, string> = {
    explorer: '🌿 Explorador (Menú)',
    program: '🔄 Programa 8 Semanas',
    bridal: '💍 Fecha Límite'
  };

  const subLabels: Record<string, string> = {
    none: 'Ninguna',
    meals: 'Menú Low-Carb',
    program: 'Programa de 8 Semanas',
    bridal: 'Preparación Especial'
  };

  return (
    <div className="min-h-screen pb-24 transition-opacity duration-300">
      <ConnectionStatus />
      <main className="max-w-md mx-auto px-4 pt-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">⚙️ Ajustes</h1>
          <p className="text-gray-600">Gestiona tu cuenta, enfoque y preferencias.</p>
        </header>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm transition-all ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* 🔐 ESTADO DE CUENTA (Dinámico) */}
        <section className={`p-4 rounded-xl shadow-sm border mb-4 transition-all ${authInfo.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : authInfo.color === 'blue' ? 'bg-blue-50 border-blue-200' : authInfo.color === 'green' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <h2 className="font-semibold mb-2">👤 Estado de tu cuenta</h2>
          <p className={`text-sm font-medium ${authInfo.color === 'yellow' ? 'text-yellow-800' : 'text-gray-800'}`}>{authInfo.label}</p>
          {authInfo.color === 'yellow' && (
            <button 
              onClick={() => navigate('/auth')} 
              className="mt-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 rounded-lg transition-all active:scale-[0.98]"
            >
              🔒 Crear cuenta segura (recuperar datos)
            </button>
          )}
        </section>

        {/* 📊 Configuración actual */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 transition-all duration-200">
          <h2 className="font-semibold mb-3">📱 Tu configuración</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Enfoque</span>
              <span className="font-medium capitalize">{trackLabels[profile.track]}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2 pt-2">
              <span className="text-gray-500">Membresía</span>
              <span className="font-medium capitalize">{subLabels[profile.subscriptionPlan] || 'Ninguna'}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-500">Programa</span>
              <span className="font-medium capitalize">{profile.programStatus === 'active' ? `Activo (Ciclo ${profile.currentCycle})` : profile.programStatus}</span>
            </div>
          </div>
        </section>

        {/* 🎯 Acciones rápidas (BOTONES HERMANOS, NO ANIDADOS) */}
        <div className="space-y-3 mb-6">
          {/* Cambiar enfoque */}
          <button
            onClick={() => navigate('/track')}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <h3 className="font-semibold text-gray-800">🔄 Cambiar enfoque</h3>
            <p className="text-sm text-gray-500 mt-1">Explorador, Programa 8 Semanas o Preparación Especial.</p>
          </button>

          {/* 📚 Aprende Low-Carb (NUEVO) */}
          <button
            onClick={() => navigate('/recursos')}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <h3 className="font-semibold text-gray-800">📚 Aprende Low-Carb</h3>
            <p className="text-sm text-gray-500 mt-1">Guías rápidas, tips de disciplina y ciencia simple.</p>
          </button>

          {/* Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <h3 className="font-semibold text-red-600">🚪 Cerrar sesión</h3>
            <p className="text-sm text-gray-500 mt-1">Salir del modo actual. Tus datos permanecen seguros en la nube.</p>
          </button>
        </div>

        {/* ⚠️ Zona de pruebas */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleResetApp}
            className="w-full text-red-500 hover:text-red-700 text-sm py-2 transition-colors"
          >
            🔄 Reiniciar app (para pruebas)
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}