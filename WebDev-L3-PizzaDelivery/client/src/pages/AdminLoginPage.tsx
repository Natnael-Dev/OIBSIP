import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ token: string }>('/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('cc_token', res.token);
      navigate('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#080B11' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <span
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.5rem',
              color: '#F8FAFC',
            }}
          >
            Crust
          </span>
          <span
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            &amp;
          </span>
          <span
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.5rem',
              color: '#F8FAFC',
            }}
          >
            Craft
          </span>
          <p
            className="mt-2"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontSize: '0.75rem',
              color: '#475569',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Operations Cockpit
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(248,250,252,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h1
            className="mb-6"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.75rem',
              color: '#F8FAFC',
            }}
          >
            Sign in
          </h1>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2.5 rounded-lg text-sm"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#EF4444',
                fontFamily: 'Switzer, sans-serif',
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Switzer, sans-serif',
                  fontSize: '0.75rem',
                  color: '#64748B',
                  marginBottom: '0.375rem',
                  letterSpacing: '0.02em',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@crustandcraft.co"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  background: 'rgba(8,11,17,0.8)',
                  border: '1px solid rgba(248,250,252,0.1)',
                  color: '#F8FAFC',
                  fontFamily: 'Switzer, sans-serif',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(245,158,11,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(248,250,252,0.1)';
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Switzer, sans-serif',
                  fontSize: '0.75rem',
                  color: '#64748B',
                  marginBottom: '0.375rem',
                  letterSpacing: '0.02em',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  background: 'rgba(8,11,17,0.8)',
                  border: '1px solid rgba(248,250,252,0.1)',
                  color: '#F8FAFC',
                  fontFamily: 'Switzer, sans-serif',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(245,158,11,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(248,250,252,0.1)';
                }}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-semibold mt-2"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#080B11',
                fontFamily: 'Switzer, sans-serif',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </motion.button>
          </form>
        </div>

        <p
          className="text-center mt-6"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontSize: '0.75rem',
            color: '#334155',
          }}
        >
          Restricted access · Crust &amp; Craft operations team only
        </p>
      </motion.div>
    </div>
  );
}
