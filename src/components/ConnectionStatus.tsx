import { useEffect, useState } from 'react';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center text-sm font-medium py-2 px-4"
      role="status"
      aria-live="polite"
    >
      ⚠️ Sin conexión. Los datos se guardarán localmente y se sincronizarán al recuperar red.
    </div>
  );
}