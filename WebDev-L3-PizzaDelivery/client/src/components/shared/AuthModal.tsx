import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthOpen) return null;

  const handleDemoFill = () => {
    setEmail('customer@crustcraft.com');
    setPassword('Customer123!');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else if (authMode === 'register') {
        await register(name, email, password, phone);
      } else if (authMode === 'forgot') {
        await api.post('/api/auth/forgot-password', { email });
        setSuccessMsg('Reset token sent to your email. You can now use your recovery link.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthOpen(false)}
        />

        {/* Modal Window */}
        <motion.div
          className="relative w-full max-w-md rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(8,11,17,0.98))',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.1)',
          }}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-lg p-1"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h3
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: '1.75rem',
                color: '#F8FAFC',
              }}
            >
              {authMode === 'login' && 'Sign In to Crust & Craft'}
              {authMode === 'register' && 'Create Your Account'}
              {authMode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {authMode === 'login' && 'Access custom saves, live order tracking, and express checkout'}
              {authMode === 'register' && 'Join Oasis SIP Artisanal Pizza Delivery platform'}
              {authMode === 'forgot' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {authMode !== 'forgot' && (
            <div className="flex rounded-full bg-slate-800/80 p-1 mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  authMode === 'login'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setError(''); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  authMode === 'register'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Natnael Tezazu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@crustcraft.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 911 223344"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {authMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot'); setError(''); }}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {error && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-slate-950 transition-all shadow-lg hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              }}
            >
              {loading
                ? 'Authenticating…'
                : authMode === 'login'
                ? 'Sign In'
                : authMode === 'register'
                ? 'Create Account'
                : 'Send Recovery Email'}
            </button>
          </form>

          {/* Quick Demo Helper */}
          {authMode === 'login' && (
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Testing evaluation?</span>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-medium text-amber-400 hover:text-amber-300 underline"
              >
                1-Click Demo Customer Fill
              </button>
            </div>
          )}

          {authMode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
