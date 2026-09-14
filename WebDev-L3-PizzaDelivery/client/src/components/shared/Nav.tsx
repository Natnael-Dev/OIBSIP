import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/builder", label: "Build" },
  { to: "/tracking", label: "Track" },
];

export default function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, setIsAuthOpen, setAuthMode } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-10"
        style={{
          zIndex: 200,
          height: 68,
          background: scrolled
            ? "rgba(8,11,17,0.82)"
            : "linear-gradient(to bottom, rgba(8,11,17,0.75) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
          transition: "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          <span
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "1.25rem",
              color: "#F8FAFC",
            }}
          >
            Crust
          </span>
          <span
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "1.25rem",
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            &amp;
          </span>
          <span
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "1.25rem",
              color: "#F8FAFC",
            }}
          >
            Craft
          </span>
        </Link>

        {/* Desktop center links */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 rounded-full text-sm"
                style={{
                  fontFamily: "Switzer, sans-serif",
                  fontWeight: active ? 500 : 400,
                  color: active ? "#080B11" : "rgba(248,250,252,0.72)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#F59E0B" }}
                    transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop right: cart + auth + admin + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Tray Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:bg-white/5"
            style={{
              border: "1px solid rgba(248,250,252,0.12)",
              color: "#F8FAFC",
            }}
          >
            <span>Tray</span>
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold font-mono"
              style={{
                background: totalItems > 0 ? "#F59E0B" : "rgba(248,250,252,0.15)",
                color: totalItems > 0 ? "#080B11" : "#94A3B8",
              }}
            >
              {totalItems}
            </span>
          </button>

          {/* User Auth state */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-sans">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="text-[11px] text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                (Logout)
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
              }}
              className="text-xs text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <Link
            to="/admin"
            className="type-label"
            style={{ color: "rgba(248,250,252,0.45)", fontSize: "11px", textDecoration: "none", letterSpacing: "0.08em" }}
          >
            Admin
          </Link>
          <Link
            to="/builder"
            className="px-5 py-2 rounded-full text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#080B11",
              fontFamily: "Switzer, sans-serif",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Order Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative z-10 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div style={{ width: 22, height: 16, position: "relative" }}>
            {[0, 6, 12].map((y, i) => (
              <motion.span
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  top: y,
                  width: i === 1 ? 16 : 22,
                  height: 1.5,
                  background: "#F8FAFC",
                  borderRadius: 1,
                  display: "block",
                  transformOrigin: "center",
                }}
                animate={
                  mobileOpen
                    ? i === 0
                      ? { rotate: 45, y: 6.5, width: 22 }
                      : i === 2
                      ? { rotate: -45, y: -5.5, width: 22 }
                      : { opacity: 0 }
                    : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? 16 : 22 }
                }
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 flex flex-col px-8 pt-24 pb-12"
            style={{ zIndex: 190, background: "rgba(8,11,17,0.97)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-2 flex-1">
              {NAV_LINKS.map((link, i) => {
                const active = location.pathname === link.to;
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      to={link.to}
                      style={{
                        display: "block",
                        fontFamily: "Instrument Serif, serif",
                        fontSize: "clamp(2rem, 10vw, 3rem)",
                        color: active ? "#F59E0B" : "#F8FAFC",
                        textDecoration: "none",
                        lineHeight: 1.15,
                        paddingBlock: "0.4rem",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 rounded-full text-center text-sm font-semibold border border-amber-500/30 text-amber-400 bg-amber-500/10 cursor-pointer"
              >
                View Tray ({totalItems})
              </button>

              {user ? (
                <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-sans">
                  <span>Signed in as {user.name}</span>
                  <button onClick={logout} className="text-red-400 underline">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-2.5 rounded-full text-center text-xs font-semibold text-slate-300 border border-white/10 bg-slate-900"
                >
                  Sign In / Register
                </button>
              )}

              <Link
                to="/builder"
                className="block text-center py-3.5 rounded-full mt-1"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#080B11",
                  fontFamily: "Switzer, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Order Custom Pizza
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
