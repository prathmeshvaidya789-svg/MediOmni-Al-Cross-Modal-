import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

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
        err.response?.data?.message || 'Login failed. Please verify your credentials or server status.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helper for quick testing
  const handleQuickDemoFill = () => {
    setEmail('clinician@omnimedi.ai');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-indigo/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo and Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-indigo items-center justify-center shadow-glow-cyan mb-4">
            <Cpu className="w-7 h-7 text-dark-900 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            MediOmni <span className="text-brand-cyan">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal Clinical & Analytical Intelligence Platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold text-slate-100">Sign In</h2>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 border border-brand-cyan/30 flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Demo Account</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  className="w-full bg-dark-800/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-dark-800/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg ${
                loading
                  ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-cyan text-dark-900 hover:bg-cyan-300 shadow-glow-cyan'
              }`}
            >
              <span>{loading ? 'Authenticating...' : 'Access Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-brand-cyan hover:underline font-semibold">
              Register here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
