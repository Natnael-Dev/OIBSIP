import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AmbientLayer from './components/ambient/AmbientLayer';
import PageTransition from './components/transitions/PageTransition';
import Nav from './components/shared/Nav';
import CartDrawer from './components/shared/CartDrawer';
import AuthModal from './components/shared/AuthModal';
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

      {/* Slide-over cart tray & customer auth modal */}
      {!isAdmin && <CartDrawer />}
      <AuthModal />

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
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
