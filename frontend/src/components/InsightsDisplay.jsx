import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRightCircle,
  Copy,
  Check,
  BarChart2,
  FileCheck,
  ShieldAlert,
  Compass,
  ExternalLink,
  Activity,
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
    const reportText = `=== ${session.title || 'Clinical Multimodal Synthesis'} ===
Domain: ${session.domain || 'Clinical / Healthcare'}
Confidence Score: ${confidenceScore}%

[EXECUTIVE CLINICAL SUMMARY]
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
    return `/uploads/${filename}`;
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      
      {/* Top Banner: Executive Clinical Synthesis & Confidence Score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Subtle decorative medical ambient gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-100/60 to-teal-50/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/90 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 tracking-wider">
                {session.domain || 'Clinical'} Intelligence
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cross-referenced {session.files?.length || 0} multimodal artifact(s)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
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
                className="flex items-center space-x-2.5 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 px-3.5 py-1.5 rounded-xl transition-all group cursor-pointer shadow-xs"
              >
                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 uppercase tracking-wider block font-bold">
                    Confidence
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-700">{confidenceScore}%</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-emerald-300 flex items-center justify-center bg-white shadow-xs group-hover:scale-105 transition-transform">
                  <BarChart2 className="w-4 h-4 text-emerald-600" />
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
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-semibold transition-colors shadow-xs"
              title="Copy plain-text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="mt-5 relative z-10">
          <div className="flex items-center space-x-2 mb-2 text-sky-700">
            <Activity className="w-4 h-4" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">Executive Clinical Synthesis</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            {summary}
          </p>
        </div>

      </div>

      {/* Structured Multi-Tab Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('correlation')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'correlation'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Modal Correlation</span>
          </button>

          <button
            onClick={() => setActiveTab('findings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'findings'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Key Findings ({keyFindings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('risks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'risks'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risk & Contradictions ({riskOrAnomalyAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'actions'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowRightCircle className="w-3.5 h-3.5" />
            <span>Recommended Actions ({recommendedActions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'media'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Ingested Media ({session.files?.length || 0})</span>
          </button>

        </div>

        {/* Tab Content Panels */}
        <div key={activeTab} className="mt-6 animate-slide-up">

          {/* TAB 1: Cross-Modal Correlation */}
          {activeTab === 'correlation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>Synthesized Multi-Modal Narrative</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                  {crossModalCorrelation || 'No cross-modal discrepancies detected across provided files.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-teal-900 leading-relaxed">
                  <strong className="text-teal-800 font-bold">Multimodal Fusion Principle:</strong> Visual features from imaging and acoustic cues from consultation recordings are mapped into a unified semantic space by Gemini, verifying diagnostic alignment and highlighting contradictions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Key Findings */}
          {activeTab === 'findings' && (
            <div className="space-y-3">
              {keyFindings.length === 0 ? (
                <p className="text-xs text-slate-500">No discrete findings logged.</p>
              ) : (
                keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all card-lift"
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">{finding}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Risk & Discrepancies */}
          {activeTab === 'risks' && (
            <div className="space-y-3">
              {riskOrAnomalyAlerts.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No critical contradictions or contraindications detected across ingested files.</span>
                </div>
              ) : (
                riskOrAnomalyAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm leading-relaxed"
                  >
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-800 font-bold mb-0.5">Alert Flag #{idx + 1}</strong>
                      <p className="text-rose-900 text-xs sm:text-sm">{alert}</p>
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
                <p className="text-xs text-slate-500">No explicit next steps generated.</p>
              ) : (
                recommendedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all card-lift"
                  >
                    <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center text-teal-600 flex-shrink-0 bg-white">
                      <ArrowRightCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-800 font-medium">{action}</span>
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
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all card-lift"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-sky-700 mb-1.5 uppercase font-bold">
                      <span className="bg-sky-100 px-1.5 py-0.5 rounded">{file.fileCategory}</span>
                      <span>•</span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                  </div>

                  {file.fileCategory === 'image' && (
                    <div className="h-32 rounded-xl overflow-hidden bg-white border border-slate-200">
                      <img
                        src={getMediaUrl(file.path)}
                        alt={file.originalName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {file.fileCategory === 'audio' && (
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <audio controls className="w-full h-8" src={getMediaUrl(file.path)}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <a
                    href={getMediaUrl(file.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1"
                  >
                    <span>View raw artifact</span>
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
