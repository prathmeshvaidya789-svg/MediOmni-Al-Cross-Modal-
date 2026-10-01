import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse, Lock, Mail, User, Building2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: 'St. Jude Multimodal Diagnostic Center',
    role: 'clinician',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickDemoFill = () => {
    setFormData({
      name: 'Dr. Evelyn Reed, MD',
      email: 'evelyn.reed@hospital.org',
      password: 'Password123!',
      organization: 'St. Jude Multimodal Diagnostic Center',
      role: 'clinician',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      console.error('[Register Error]:', err);
      setError(err.response?.data?.message || 'Registration failed. Please review your input.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all outline-none";
  const inputStyle = { background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' };

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)' }}
      >
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
          <p className="text-white/70 text-sm">Join the Future of Clinical Intelligence</p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          {[
            { title: 'Multimodal Analysis', desc: 'Process MRI, EHR, genomics, and more in a unified AI model.' },
            { title: 'Real-Time Insights', desc: 'Sub-3-second synthesis with confidence scoring and risk alerts.' },
            { title: 'HIPAA Compliant', desc: 'Enterprise-grade security with end-to-end encryption.' },
            { title: 'AI Copilot', desc: 'Ask complex clinical questions in natural language.' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-white/65 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0D9488, #0284C7)' }}>
              <HeartPulse className="w-7 h-7 text-white stroke-[2]" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0F172A' }}>
              MediOmni <span style={{ color: '#0284C7' }}>AI</span>
            </h1>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0F172A' }}>Create Account</h2>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
              Register as a verified clinical practitioner
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 space-y-4"
            style={{ border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            {/* Quick Demo Fill */}
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: '#F0FDFA',
                color: '#0D9488',
                border: '1px solid #99F6E4',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-fill Demo Practitioner Info
            </button>

            {error && (
              <div className="flex items-center gap-2 text-xs p-3 rounded-xl"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
                  <input
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    placeholder="Dr. Evelyn Reed, MD"
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
                  <input
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    placeholder="evelyn.reed@hospital.org"
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
                  <input
                    type="password" name="password" required minLength={6}
                    value={formData.password} onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
              </div>

              {/* Role + Institution */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                    Role
                  </label>
                  <select
                    name="role" value={formData.role} onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={{ ...inputStyle, border: '1.5px solid #E2E8F0' }}
                    onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  >
                    <option value="clinician">Clinician / Physician</option>
                    <option value="researcher">Medical Researcher</option>
                    <option value="analyst">Diagnostic Analyst</option>
                    <option value="user">General Specialist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                    Institution
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 pointer-events-none" style={{ color: '#94A3B8' }} />
                    <input
                      type="text" name="organization"
                      value={formData.organization} onChange={handleChange}
                      placeholder="Clinic or Lab"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl transition-all outline-none"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = '#0284C7')}
                      onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-2"
                style={{
                  background: loading ? '#CBD5E1' : 'linear-gradient(90deg, #0D9488, #0284C7)',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(13, 148, 136, 0.4)',
                }}
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#0284C7' }}>
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
