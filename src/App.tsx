import { Routes, Route } from 'react-router-dom';
import LogForm from './pages/LogForm';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import TrackSelector from './pages/TrackSelector';
import TrackDashboard from './components/TrackDashboard';
import Welcome from './pages/Welcome';
import AuthScreen from './pages/AuthScreen';
import MenuCatalog from './pages/MenuCatalog';
import Resources from './pages/Resources';

function App() {
  return (
    <Routes>
      {/* 🌐 PÚBLICAS */}
      <Route path="/recursos" element={<Resources />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/auth" element={<AuthScreen />} />

      {/* 🔒 APP (funcionan con sesión anónima o real) */}
      <Route path="/" element={<TrackDashboard />} />
      <Route path="/log" element={<LogForm />} />
      <Route path="/progreso" element={<Progress />} />
      <Route path="/perfil" element={<Settings />} />
      <Route path="/track" element={<TrackSelector />} />
      <Route path="/menu" element={<MenuCatalog />} />
    </Routes>
  );
}

export default App;