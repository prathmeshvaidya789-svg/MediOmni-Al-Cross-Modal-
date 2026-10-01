import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud, FileText, Music, Image as ImageIcon, Video, X,
  Sparkles, AlertCircle, FileCheck, Stethoscope, Scale,
  GraduationCap, Layers, Mic, RefreshCw, ArrowRight,
} from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

const DOMAIN_OPTIONS = [
  {
    id: 'Healthcare', label: 'Clinical / Healthcare', icon: Stethoscope,
    desc: 'Correlate patient audio, lab PDFs, and medical scans',
    accentColor: 'from-sky-500 to-teal-500',
  },
  {
    id: 'Legal', label: 'Legal & Compliance', icon: Scale,
    desc: 'Analyze depositions, contracts, and scanned evidence',
    accentColor: 'from-indigo-500 to-sky-500',
  },
  {
    id: 'Research', label: 'Academic & Research', icon: GraduationCap,
    desc: 'Cross-reference papers, charts, and audio logs',
    accentColor: 'from-teal-500 to-emerald-500',
  },
  {
    id: 'General', label: 'Cross-Domain', icon: Layers,
    desc: 'Unified multimodal analysis across all media types',
    accentColor: 'from-slate-600 to-slate-400',
  },
];

const PRESET_PROMPTS = [
  "Correlate patient audio consultation with handwritten notes and lab PDF to flag any medication discrepancies.",
  "Identify radiological anomalies in the medical image and verify against the clinical symptom summary.",
  "Cross-reference spoken consultation timeline with documented diagnostic test timestamps.",
];

const getFileCategory = (file) => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type === 'application/pdf' || file.type.startsWith('text/')) return 'document';
  if (file.type.startsWith('video/')) return 'video';
  return 'other';
};

const categoryMeta = {
  image:    { icon: ImageIcon,  label: 'IMAGE',    color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  audio:    { icon: Music,      label: 'AUDIO',    color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200'  },
  document: { icon: FileText,   label: 'DOCUMENT', color: 'text-teal-700',    bg: 'bg-teal-50',    border: 'border-teal-200'  },
  video:    { icon: Video,      label: 'VIDEO',    color: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200'  },
  other:    { icon: FileCheck,  label: 'FILE',     color: 'text-slate-700',   bg: 'bg-slate-50',   border: 'border-slate-200'   },
};

const FileUploader = ({ onProcessStart, isProcessing, initialCase }) => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [domain, setDomain] = useState('Healthcare');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const fileInputRef = useRef(null);

  // Sync with quick case selector
  useEffect(() => {
    if (initialCase) {
      if (initialCase.defaultPrompt) setPrompt(initialCase.defaultPrompt);
      if (initialCase.title) setTitle(initialCase.title);
      if (initialCase.domain) setDomain('Healthcare');
    }
  }, [initialCase]);

  const handleFiles = (incomingFiles) => {
    setError(null);
    const validFiles = Array.from(incomingFiles);
    if (files.length + validFiles.length > 10) {
      setError('Maximum 10 files per multimodal session.');
      return;
    }
    for (const file of validFiles) {
      if (file.size > 25 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 25 MB limit.`);
        return;
      }
    }
    const enhanced = validFiles.map((file) => ({
      file,
      category: getFileCategory(file),
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setFiles((prev) => [...prev, ...enhanced]);
  };

  const handleVoiceRecording = (blob, filename) => {
    const syntheticFile = new File([blob], filename, { type: blob.type || 'audio/webm' });
    setFiles((prev) => [
      ...prev,
      { file: syntheticFile, category: 'audio', previewUrl: null },
    ]);
    setShowVoice(false);
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const copy = [...prev];
      if (copy[index]?.previewUrl) URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (files.length === 0 && !prompt.trim()) {
      setError('Please attach at least one multimodal artifact or provide an analytical prompt.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title || `Clinical Case — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    formData.append('prompt', prompt);
    formData.append('domain', domain);
    files.forEach((item) => formData.append('files', item.file));
    onProcessStart(formData);
  };

  return (
    <div id="multimodal-uploader" className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden animate-fade-in">

      <form onSubmit={handleSubmit} className="relative z-10 space-y-7">

        {/* ── Step 1: Intelligence Domain ────────────────────────────── */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-sky-100 text-sky-700 text-[11px] font-black mr-2">01</span>
            Clinical Intelligence Domain
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DOMAIN_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = domain === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDomain(item.id)}
                  className={`relative flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 group overflow-hidden ${
                    isSelected
                      ? 'bg-sky-50/70 border-sky-500 text-sky-950 shadow-sm ring-1 ring-sky-500/30'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Top accent line */}
                  {isSelected && (
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentColor}`} />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-500 border border-slate-200 group-hover:text-slate-800'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-normal line-clamp-2">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Ingest Artifacts ─────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-sky-100 text-sky-700 text-[11px] font-black mr-2">02</span>
              Ingest Multimodal Artifacts
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVoice((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  showVoice
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/50'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-teal-600" />
                {showVoice ? 'Hide Recorder' : 'Record Voice Note'}
              </button>
              <span className="text-[11px] text-slate-500 hidden sm:inline">PNG · JPG · MP3 · WAV · PDF · TXT (25MB max)</span>
            </div>
          </div>

          {/* Voice recorder widget */}
          {showVoice && (
            <div className="mb-3 animate-slide-up">
              <VoiceRecorder onRecordingComplete={handleVoiceRecording} disabled={isProcessing} />
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag} onDragOver={handleDrag}
            onDragLeave={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[160px] overflow-hidden ${
              dragActive
                ? 'border-sky-500 bg-sky-50/80 scale-[1.005]'
                : 'border-slate-300 bg-slate-50/50 hover:border-sky-500 hover:bg-sky-50/20'
            }`}
          >
            <input
              ref={fileInputRef} type="file" multiple className="hidden"
              accept="image/*,audio/*,video/*,application/pdf,text/plain"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200 ${
              dragActive
                ? 'bg-sky-100 text-sky-600 scale-110'
                : 'bg-white border border-slate-200 shadow-xs text-sky-600'
            }`}>
              <UploadCloud className="w-7 h-7 stroke-[2]" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {dragActive ? 'Release to attach clinical files' : <>Drag & drop files here, or <span className="text-sky-600 underline font-extrabold hover:text-sky-700">browse</span></>}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Attach consultation audio recording, Chest X-Ray / CT scan, pathology lab PDF, or handwritten prescription notes.
            </p>
          </div>
        </div>

        {/* Attached files grid */}
        {files.length > 0 && (
          <div className="space-y-2.5 animate-slide-up">
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <span className="font-bold">
                Attached Artifacts <span className="text-sky-600 font-mono font-bold">({files.length}/10)</span>
              </span>
              <button type="button" onClick={() => setFiles([])} className="text-rose-600 hover:underline flex items-center gap-1 font-semibold text-xs">
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {files.map((item, idx) => {
                const meta = categoryMeta[item.category] || categoryMeta.other;
                const Icon = meta.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.previewUrl ? (
                        <img src={item.previewUrl} alt="preview" className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                      ) : (
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.border} border`}>
                          <Icon className={`w-4 h-4 ${meta.color}`} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.file.name}</p>
                        <p className={`text-[10px] font-mono font-semibold ${meta.color}`}>
                          {meta.label} · {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-2 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Analytical Objective & Synthesis ──────────────── */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-sky-100 text-sky-700 text-[11px] font-black mr-2">03</span>
            Synthesis Directive & Context
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Case Title (e.g. Patient Clinical Handover — Case #8492)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all mb-3"
          />

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Specify synthesis directives: 'Cross-reference medication spoken during the audio consultation against dosage in the patient chart, and flag any contraindications with the CBC lab panel.'"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all resize-none font-sans"
          />

          {/* Quick preset chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Suggested:</span>
            {PRESET_PROMPTS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(p)}
                className="text-[11px] bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-800 border border-slate-200 hover:border-sky-200 px-2.5 py-1 rounded-lg transition-all text-left"
              >
                {p.slice(0, 55)}...
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
            <button type="button" onClick={() => setError(null)} className="text-rose-600 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-md transition-all ${
              isProcessing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'btn-emerald-cta text-white shadow-emerald-500/25'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                <span>Synthesizing Multimodal Diagnostic Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-100 stroke-[2.5]" />
                <span>Run Unified Multimodal Synthesis</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
            Powered by Google Gemini Multimodal Decision Engine · Clinical Privacy Preserved
          </p>
        </div>

      </form>
    </div>
  );
};

export default FileUploader;
