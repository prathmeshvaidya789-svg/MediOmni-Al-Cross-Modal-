import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  LogOut,
  User,
  Sparkles,
  ShieldCheck,
  Plus,
} from 'lucide-react';

const Navbar = ({ onNewSession }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Medical Indicator */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center shadow-md shadow-sky-600/20 transform transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  MediOmni <span className="text-sky-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 tracking-wider">
                  Clinical Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>Multimodal Decision Support · HIPAA & ISO Compliant</span>
              </p>
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
                  className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold btn-emerald-cta"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>New Case Ingestion</span>
                </button>
              )}

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center space-x-3 pl-1">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900">{user?.name || 'Practitioner'}</span>
                  <span className="text-[10px] text-sky-700 font-semibold">{user?.role || 'Clinician'} · {user?.organization || 'Clinical Center'}</span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shadow-sm">
                  <User className="w-4 h-4 stroke-[2.5]" />
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl transition-colors hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold btn-blue-cta px-4 py-2 rounded-xl"
              >
                Practitioner Onboarding
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
