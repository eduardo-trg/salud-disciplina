import { useLocation, Link } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();

  // ✅ NUEVO: Agregado el ítem '/menu'
  const navItems = [
    { href: '/', icon: '🏠', label: 'Inicio' },
    { href: '/menu', icon: '🍽️', label: 'Menú' },
    { href: '/progreso', icon: '📊', label: 'Progreso' },
    { href: '/perfil', icon: '⚙️', label: 'Perfil' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl mb-1" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}