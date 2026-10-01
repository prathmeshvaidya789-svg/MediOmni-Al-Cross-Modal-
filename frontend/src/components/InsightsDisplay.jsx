import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRightCircle,
  Copy,
  Check,
  Share2,
  BarChart2,
  FileCheck,
  ShieldAlert,
  Compass,
  ExternalLink,
  Info,
} from 'lucide-react';
import ConfidenceModal from './ConfidenceModal';
import ExportReportButton from './ExportReportButton';
import { SynthesisSkeleton } from './SkeletonLoader';

const InsightsDisplay = ({ session, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('correlation');
  const [copied, setCopied] = useState(false);
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);

  if (isLoading) {
    return <SynthesisSkeleton />;
  }

  if (!session || !session.aiAnalysis) {
    return null;
  }

  const {
    summary = 'No summary available.',
    keyFindings = [],
    crossModalCorrelation = '',
    riskOrAnomalyAlerts = [],
    recommendedActions = [],
    confidenceScore = 95,
  } = session.aiAnalysis;

  const handleCopySummary = () => {
    const reportText = `=== ${session.title || 'Multimodal Synthesis'} ===
Domain: ${session.domain || 'General'}
Confidence: ${confidenceScore}%

[EXECUTIVE SUMMARY]
${summary}

[CROSS-MODAL CORRELATION]
${crossModalCorrelation}

[KEY FINDINGS]
${keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

[RISKS & ALERTS]
${riskOrAnomalyAlerts.map((a, i) => `! ${a}`).join('\n')}

[RECOMMENDED ACTIONS]
${recommendedActions.map((r, i) => `> ${r}`).join('\n')}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    const filename = path.split('\\').pop().split('/').pop();
    return `http://localhost:5000/uploads/${filename}`;
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner: Executive Summary & Confidence Gauge */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-bold">
                {session.domain} Intelligence
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                Processed {session.files?.length || 0} multimodal artifact(s)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight">
              {session.title || 'Multimodal Synthesis Report'}
            </h2>
          </div>

          {/* Quick Actions & Confidence Score */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Clickable Confidence Score Badge with Tooltip */}
            <div className="tooltip-container">
              <button
                type="button"
                onClick={() => setShowConfidenceModal(true)}
                className="flex items-center space-x-2 bg-dark-800/90 hover:bg-dark-700/90 border border-emerald-400/30 hover:border-emerald-400/60 px-3.5 py-1.5 rounded-xl transition-all group cursor-pointer shadow-sm hover:shadow-glow-cyan"
              >
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 uppercase tracking-wider block font-semibold">
                    Confidence
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{confidenceScore}%</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-400/40 flex items-center justify-center bg-emerald-400/10 group-hover:scale-105 transition-transform">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                </div>
              </button>
              <div className="tooltip-content -bottom-9 right-0 w-52 text-center z-20">
                Click for per-modality confidence breakdown
              </div>
            </div>

            {/* Export Report Dropdown */}
            <ExportReportButton session={session} />

            {/* Quick Copy Button */}
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 border border-white/10 hover:border-white/25 text-xs font-medium transition-colors"
              title="Copy plain-text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="mt-5">
          <div className="flex items-center space-x-2 mb-2 text-brand-cyan">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Executive Synthesis</h3>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans bg-dark-800/50 p-4 rounded-xl border border-white/5">
            {summary}
          </p>
        </div>

      </div>

      {/* Structured Multi-Tab Navigation */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('correlation')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'correlation'
                ? 'bg-brand-cyan text-dark-900 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Modal Correlation</span>
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'findings'
                ? 'bg-brand-cyan text-dark-900 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Key Findings ({keyFindings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('risks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'risks'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risk & Discrepancies ({riskOrAnomalyAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'actions'
                ? 'bg-brand-cyan text-dark-900 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <ArrowRightCircle className="w-3.5 h-3.5" />
            <span>Recommended Actions ({recommendedActions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'media'
                ? 'bg-brand-cyan text-dark-900 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Ingested Media ({session.files?.length || 0})</span>
          </button>

        </div>

        {/* Tab Content Panels with slide-in animation */}
        <div key={activeTab} className="mt-6 animate-slide-up">

          {/* TAB 1: Cross-Modal Correlation */}
          {activeTab === 'correlation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-dark-800/60 border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-brand-cyan" />
                  <span>Synthesized Multi-Modal Narrative</span>
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {crossModalCorrelation || 'No cross-modal discrepancies detected across provided files.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-normal">
                  <strong className="text-brand-cyan">Multimodal Fusion Principle:</strong> Visual features from imaging and acoustic cues from consultation recordings are mapped into a unified semantic space by Gemini, ensuring diagnostic accuracy and cross-referencing anomalies.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Key Findings */}
          {activeTab === 'findings' && (
            <div className="space-y-3">
              {keyFindings.length === 0 ? (
                <p className="text-sm text-slate-400">No discrete findings logged.</p>
              ) : (
                keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-xl bg-dark-800/60 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-brand-cyan/15 text-brand-cyan flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">{finding}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Risk & Discrepancies */}
          {activeTab === 'risks' && (
            <div className="space-y-3">
              {riskOrAnomalyAlerts.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No critical contradictions or contraindications detected across ingested files.</span>
                </div>
              ) : (
                riskOrAnomalyAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-200 text-sm leading-relaxed"
                  >
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-300 font-semibold mb-0.5">Alert Flag #{idx + 1}</strong>
                      <p className="text-slate-200 text-xs sm:text-sm">{alert}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Recommended Actions */}
          {activeTab === 'actions' && (
            <div className="space-y-2.5">
              {recommendedActions.length === 0 ? (
                <p className="text-sm text-slate-400">No explicit next steps generated.</p>
              ) : (
                recommendedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3.5 rounded-xl bg-dark-800/80 border border-white/5 hover:border-brand-cyan/30 transition-all"
                  >
                    <div className="w-5 h-5 rounded-md border border-slate-600 flex items-center justify-center text-brand-cyan flex-shrink-0">
                      <ArrowRightCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-slate-200">{action}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: Ingested Media Gallery */}
          {activeTab === 'media' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {session.files?.map((file, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-dark-800/90 border border-white/5 space-y-3 flex flex-col justify-between hover:border-white/15 transition-all"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-brand-cyan mb-1.5 uppercase font-semibold">
                      <span>{file.fileCategory}</span>
                      <span>•</span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                  </div>

                  {file.fileCategory === 'image' && (
                    <div className="h-32 rounded-lg overflow-hidden bg-dark-900 border border-white/5">
                      <img
                        src={getMediaUrl(file.path)}
                        alt={file.originalName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {file.fileCategory === 'audio' && (
                    <div className="p-2 rounded-lg bg-dark-900 border border-white/5">
                      <audio controls className="w-full h-8" src={getMediaUrl(file.path)}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <a
                    href={getMediaUrl(file.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-brand-cyan hover:underline flex items-center space-x-1"
                  >
                    <span>View raw source</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Confidence Breakdown Modal */}
      {showConfidenceModal && (
        <ConfidenceModal
          session={session}
          onClose={() => setShowConfidenceModal(false)}
        />
      )}

    </div>
  );
};

export default InsightsDisplay;
