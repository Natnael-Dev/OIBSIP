import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AmbientLayer from './components/ambient/AmbientLayer';
import PageTransition from './components/transitions/PageTransition';
import Nav from './components/shared/Nav';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import BuilderPage from './pages/BuilderPage';
import TrackingPage from './components/tracking/TrackingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminCockpitPage from './pages/AdminCockpitPage';

function AppInner() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Ambient video — not shown on admin screens */}
      {!isAdmin && <AmbientLayer />}

      {/* Nav — not shown on admin screens */}
      {!isAdmin && <Nav />}

      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<MenuPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminCockpitPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PageTransition>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </BrowserRouter>
  );
}
