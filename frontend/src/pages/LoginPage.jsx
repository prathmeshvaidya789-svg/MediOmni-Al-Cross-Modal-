import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Lock, Mail, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('[Login Error]:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('clinician@omnimedi.ai');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'rgba(255,255,255,0.3)' }} />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'rgba(255,255,255,0.4)' }} />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">MediOmni AI</span>
          </div>
          <p className="text-white/70 text-sm">Multimodal Clinical Intelligence Platform</p>
        </div>

        {/* Trust metrics */}
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '99.8%', label: 'Diagnostic Accuracy' },
              { value: '2.3s', label: 'Avg. Analysis Time' },
              { value: '50K+', label: 'Cases Processed' },
              { value: 'HIPAA', label: 'Compliant & Secure' },
            ].map((m) => (
              <div key={m.label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <p className="text-2xl font-extrabold text-white">{m.value}</p>
                <p className="text-xs text-white/70 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-2xl p-4">
            <ShieldCheck className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/80 leading-relaxed">
              Trusted by leading hospitals and research institutions. All data processed with
              end-to-end encryption and SOC 2 Type II compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0284C7, #0D9488)' }}>
              <HeartPulse className="w-7 h-7 text-white stroke-[2]" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0F172A' }}>
              MediOmni <span style={{ color: '#0284C7' }}>AI</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0F172A' }}>Welcome back</h2>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>Sign in to your clinical workspace</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 space-y-5"
            style={{ border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            {/* Demo fill */}
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: '#EFF6FF',
                color: '#0284C7',
                border: '1px solid #BFDBFE',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-fill Demo Credentials
            </button>

            {error && (
              <div className="flex items-center gap-2 text-xs p-3 rounded-xl"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                  style={{ color: '#374151' }}>
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@hospital.org"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all outline-none"
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      color: '#0F172A',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                  style={{ color: '#374151' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all outline-none"
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      color: '#0F172A',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: loading
                    ? '#CBD5E1'
                    : 'linear-gradient(90deg, #0284C7, #0D9488)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.4)',
                }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#0284C7' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
