import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Cpu,
  LogOut,
  User,
  Sparkles,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';

const Navbar = ({ onNewSession }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Model Indicator */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan via-brand-blue to-brand-indigo flex items-center justify-center shadow-glow-cyan transform transition-transform group-hover:scale-105">
              <Cpu className="w-5 h-5 text-dark-900 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  MediOmni <span className="text-brand-cyan">AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 font-semibold tracking-wider">
                  v2.0 Multimodal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Cross-Modal Synthesis & Decision Support</p>
            </div>
          </Link>
        </div>

        {/* Right Section Actions & User Status */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {onNewSession && (
                <button
                  onClick={onNewSession}
                  className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 border border-brand-cyan/30 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Case Ingestion</span>
                </button>
              )}

              <div className="h-6 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center space-x-3 pl-1">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{user?.name || 'Practitioner'}</span>
                  <span className="text-[10px] text-brand-cyan font-mono">{user?.role || 'Clinician'} · {user?.organization || 'Clinical Lab'}</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-brand-cyan text-dark-900 hover:bg-cyan-300 px-3.5 py-1.5 rounded-lg transition-all shadow-glow-cyan"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
