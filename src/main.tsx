import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { useAuth } from './hooks/useAuth';

function AuthWrapper() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Iniciando sesión segura...</div>;
  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">Error de conexión segura.</div>;
  
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthWrapper />
  </React.StrictMode>
);