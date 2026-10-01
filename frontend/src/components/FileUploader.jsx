import React, { useState, useRef } from 'react';
import {
  UploadCloud, FileText, Music, Image as ImageIcon, Video, X,
  Sparkles, AlertCircle, FileCheck, Stethoscope, Scale,
  GraduationCap, Layers, Mic, RefreshCw,
} from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

const DOMAIN_OPTIONS = [
  {
    id: 'Healthcare', label: 'Clinical / Healthcare', icon: Stethoscope,
    desc: 'Correlate patient audio, lab PDFs, and medical scans',
    accentColor: 'from-brand-cyan to-teal-400',
  },
  {
    id: 'Legal', label: 'Legal & Compliance', icon: Scale,
    desc: 'Analyze depositions, contracts, and scanned evidence',
    accentColor: 'from-indigo-400 to-purple-400',
  },
  {
    id: 'Research', label: 'Academic & Research', icon: GraduationCap,
    desc: 'Cross-reference papers, charts, and audio logs',
    accentColor: 'from-amber-400 to-orange-400',
  },
  {
    id: 'General', label: 'Cross-Domain', icon: Layers,
    desc: 'Unified multimodal analysis across all media types',
    accentColor: 'from-rose-400 to-pink-400',
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
  image:    { icon: ImageIcon,  label: 'IMAGE',    color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  audio:    { icon: Music,      label: 'AUDIO',    color: 'text-brand-cyan',  bg: 'bg-brand-cyan/10',  border: 'border-brand-cyan/20'  },
  document: { icon: FileText,   label: 'DOCUMENT', color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  border: 'border-indigo-400/20'  },
  video:    { icon: Video,      label: 'VIDEO',    color: 'text-purple-400',  bg: 'bg-purple-400/10',  border: 'border-purple-400/20'  },
  other:    { icon: FileCheck,  label: 'FILE',     color: 'text-slate-400',   bg: 'bg-slate-400/10',   border: 'border-slate-400/20'   },
};

const FileUploader = ({ onProcessStart, isProcessing }) => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [domain, setDomain] = useState('Healthcare');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const fileInputRef = useRef(null);

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
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.length && !prompt.trim()) {
      setError('Please attach at least one multimodal artifact or enter a focus prompt.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title || `Case Analysis — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    formData.append('prompt', prompt);
    formData.append('domain', domain);
    files.forEach((item) => formData.append('files', item.file));
    onProcessStart(formData);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden animate-fade-in">

      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-7">

        {/* ── Step 1: Domain ────────────────────────────── */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
            <span className="text-brand-cyan mr-1.5">01</span> Intelligence Domain
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
                  className={`relative flex flex-col text-left p-4 rounded-xl border transition-all duration-200 group overflow-hidden ${
                    isSelected
                      ? 'bg-brand-cyan/10 border-brand-cyan text-white shadow-glow-cyan scale-[1.02]'
                      : 'bg-dark-800/60 border-white/5 text-slate-400 hover:border-white/20 hover:bg-dark-800 hover:scale-[1.01] hover:shadow-md'
                  }`}
                >
                  {/* Active gradient bar */}
                  {isSelected && (
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.accentColor}`} />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isSelected ? 'bg-brand-cyan/20' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-cyan' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    </div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-normal line-clamp-2">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Artifacts ─────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              <span className="text-brand-cyan mr-1.5">02</span> Ingest Artifacts
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVoice((v) => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                  showVoice
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : 'bg-dark-800 border-white/10 text-slate-300 hover:border-rose-500/30 hover:text-rose-300'
                }`}
              >
                <Mic className="w-3 h-3" />
                {showVoice ? 'Hide Recorder' : 'Record Voice Note'}
              </button>
              <span className="text-[10px] text-slate-500">PNG · JPG · MP3 · WAV · PDF · TXT · MP4 · 25 MB max</span>
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
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[150px] overflow-hidden ${
              dragActive
                ? 'border-brand-cyan bg-brand-cyan/10 scale-[1.005] shadow-glow-cyan'
                : 'border-slate-700/80 bg-dark-800/30 hover:border-slate-500 hover:bg-dark-800/60 hover:shadow-md'
            }`}
          >
            <input
              ref={fileInputRef} type="file" multiple className="hidden"
              accept="image/*,audio/*,video/*,application/pdf,text/plain"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
              dragActive
                ? 'bg-brand-cyan/25 border-brand-cyan/60 shadow-glow-cyan scale-110'
                : 'bg-gradient-to-tr from-brand-cyan/15 to-brand-indigo/15 border border-brand-cyan/20'
            }`}>
              <UploadCloud className={`w-7 h-7 text-brand-cyan transition-all ${dragActive ? 'scale-110' : 'animate-pulse-slow'}`} />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {dragActive ? 'Release to attach files' : <>Drag & Drop, or <span className="text-brand-cyan underline hover:text-cyan-300">browse</span></>}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Mix sources — Doctor audio + Lab PDF + MRI scan + Clinical notes
            </p>
          </div>
        </div>

        {/* Attached files grid */}
        {files.length > 0 && (
          <div className="space-y-2.5 animate-slide-up">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold">
                Attached Artifacts <span className="text-brand-cyan font-mono">({files.length}/10)</span>
              </span>
              <button type="button" onClick={() => setFiles([])} className="text-rose-400 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {files.map((item, idx) => {
                const meta = categoryMeta[item.category] || categoryMeta.other;
                const CatIcon = meta.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border ${meta.border} ${meta.bg} group hover:scale-[1.01] transition-all duration-200 animate-slide-up`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt={item.file.name} className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${meta.border} bg-dark-900/60`}>
                        <CatIcon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{item.file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono font-bold ${meta.color}`}>{meta.label}</span>
                        <span className="text-[10px] text-slate-500">·</span>
                        <span className="text-[10px] text-slate-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Title + Prompt ────────────────────── */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
            <span className="text-brand-cyan mr-1.5">03</span> Session Context
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">Case Title</label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Patient #4092 Workup"
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/20 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">Focus Objective / Prompt</label>
              <input
                type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Highlight medication discrepancies and correlate audio symptoms with radiology"
                className="w-full bg-dark-800/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preset prompts */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] text-slate-500 flex items-center mr-1 self-center">
            <Sparkles className="w-3 h-3 text-brand-cyan mr-1" /> Quick Focus:
          </span>
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx} type="button"
              onClick={() => setPrompt(preset)}
              className="text-[11px] bg-dark-800/80 hover:bg-dark-700 text-slate-300 hover:text-white border border-white/5 hover:border-brand-cyan/30 rounded-full px-3 py-1.5 transition-all truncate max-w-[280px] sm:max-w-md hover:shadow-glow-cyan/20"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl animate-slide-up">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit" disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-lg tracking-wide ${
            isProcessing
              ? 'bg-dark-700/80 text-slate-400 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo text-dark-900 hover:opacity-95 hover:scale-[1.005] hover:shadow-glow-cyan active:scale-[0.998]'
          }`}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synthesizing Multimodal Knowledge…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Run Unified Multimodal Synthesis</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default FileUploader;
