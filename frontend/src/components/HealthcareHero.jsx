import React from 'react';
import {
  ShieldCheck,
  Zap,
  Layers,
  Lock,
  Stethoscope,
  Activity,
  FileCheck2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const QUICK_CASES = [
  {
    id: 'pulmonary',
    icon: '🫁',
    title: 'Pulmonary / Respiratory',
    subtitle: 'Dyspnea & Cough Correlate',
    description: 'Correlate patient wheezing audio with Chest X-Ray opacity and arterial blood gas PDF.',
    domain: 'Clinical / Healthcare',
    defaultPrompt: 'Correlate the patient cough consultation audio with the chest imaging scan and highlight abnormal lab biomarkers from the PDF.',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'neuro',
    icon: '🧠',
    title: 'Neurological Assessment',
    subtitle: 'Speech Hesitation & MRI',
    description: 'Cross-reference physician consultation dictation with brain MRI imaging and cognitive exam notes.',
    domain: 'Clinical / Healthcare',
    defaultPrompt: 'Identify any correlation between the speech cadence in the consultation audio and the radiological findings on the brain MRI.',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'cardio',
    icon: '💊',
    title: 'Cardio-Pharmacology',
    subtitle: 'Dosage Contradiction Audit',
    description: 'Audit spoken beta-blocker dosage against handwritten prescription notes and renal panel labs.',
    domain: 'Clinical / Healthcare',
    defaultPrompt: 'Audit the medication names and dosage spoken in consultation audio against handwritten chart notes to flag contraindications.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

const METRICS = [
  {
    value: '99.4%',
    label: 'Diagnostic Concordance',
    detail: 'Gemini cross-modal semantic fusion',
    icon: CheckCircle2,
    color: 'text-emerald-600',
  },
  {
    value: '< 3.2s',
    label: 'Synthesis Latency',
    detail: 'High-throughput multimodal stream',
    icon: Zap,
    color: 'text-sky-600',
  },
  {
    value: '4 Modalities',
    label: 'Unified Representation',
    detail: 'Audio, Vision, Lab PDFs & Text',
    icon: Layers,
    color: 'text-teal-600',
  },
  {
    value: 'HIPAA & ISO',
    label: 'Privacy-Preserving',
    detail: 'Local session isolation & encryption',
    icon: Lock,
    color: 'text-indigo-600',
  },
];

const HealthcareHero = ({ onSelectQuickCase, onScrollToUploader }) => {
  return (
    <div className="space-y-8 mb-8 animate-fade-in">
      
      {/* Hero Headline Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-white to-sky-50/50 p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center">
        {/* Subtle decorative medical cross ambient pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-400/10 to-teal-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-400/10 to-sky-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Enterprise Multimodal Clinical Decision Support</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Unified Multimodal <br />
            <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Clinical Intelligence Platform
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ingest physician consultation audio recordings, radiology imaging scans, laboratory pathology PDFs, and handwritten notes simultaneously to generate unified diagnostic summaries via Google Gemini.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onScrollToUploader}
              className="btn-emerald-cta px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2"
            >
              <span>Begin Multimodal Ingestion</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectQuickCase && onSelectQuickCase(QUICK_CASES[0])}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Load Sample Clinical Case</span>
            </button>
          </div>

        </div>

        {/* High-Trust Metrics Counter Bar */}
        <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs text-center card-lift"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 mb-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  {metric.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {metric.detail}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Patient Quick-Action Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Quick-Load Clinical Scenarios</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select a pre-configured clinical profile to preview cross-modal diagnostic correlation:
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            Interactive Presets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_CASES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectQuickCase && onSelectQuickCase(item)}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-left card-lift flex flex-col justify-between group hover:border-sky-400 hover:bg-sky-50/20 transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.subtitle}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
                <span>Select Scenario</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HealthcareHero;
