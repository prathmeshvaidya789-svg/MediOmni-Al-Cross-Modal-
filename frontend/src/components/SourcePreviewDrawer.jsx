import React, { useEffect } from 'react';
import { X, FileText, Music, Image as ImageIcon, Video, FileCheck, ExternalLink } from 'lucide-react';

/**
 * SourcePreviewDrawer – slide-in panel showing a quick preview of a cited source file.
 * Triggered when the user clicks a source citation pill inside ChatInterface.
 */
const SourcePreviewDrawer = ({ file, sessionFiles = [], onClose }) => {
  // Resolve the full file metadata from the session's file list
  const fileMeta = sessionFiles.find(
    (f) => f.originalName === file || f.filename === file
  );

  const getMediaUrl = (path) => {
    if (!path) return '';
    const filename = path.split('\\').pop().split('/').pop();
    return `http://localhost:5000/uploads/${filename}`;
  };

  const category = fileMeta?.fileCategory || 'other';
  const mediaUrl = fileMeta ? getMediaUrl(fileMeta.path) : '';

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const CategoryIcon = {
    image:    ImageIcon,
    audio:    Music,
    document: FileText,
    video:    Video,
  }[category] || FileCheck;

  const categoryColor = {
    image:    'text-emerald-400',
    audio:    'text-brand-cyan',
    document: 'text-indigo-400',
    video:    'text-purple-400',
  }[category] || 'text-slate-400';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-panel border-l border-white/10 shadow-2xl flex flex-col"
        style={{ animation: 'slideInLeft 0.28s cubic-bezier(0.4,0,0.2,1) both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-dark-800/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-dark-700 border border-white/10 flex items-center justify-center flex-shrink-0">
              <CategoryIcon className={`w-4 h-4 ${categoryColor}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{fileMeta?.originalName || file}</p>
              <p className={`text-[10px] font-mono uppercase font-semibold ${categoryColor}`}>
                {category} · {fileMeta ? `${(fileMeta.size / 1024 / 1024).toFixed(2)} MB` : 'Reference'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!fileMeta && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              Source metadata not available for preview. The file reference was cited by the AI but may have been deleted or is session-scoped.
            </div>
          )}

          {category === 'image' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-400 tracking-wider font-semibold mb-2">Image Preview</p>
              <img
                src={mediaUrl}
                alt={fileMeta?.originalName}
                className="w-full rounded-xl border border-white/10 object-contain max-h-64"
              />
            </div>
          )}

          {category === 'audio' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-400 tracking-wider font-semibold mb-2">Audio Playback</p>
              <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20">
                <audio controls className="w-full" src={mediaUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Recorded consultation audio referenced by the AI Copilot.
              </p>
            </div>
          )}

          {category === 'document' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-400 tracking-wider font-semibold mb-2">Document Source</p>
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <p className="text-xs text-slate-300">
                  PDF documents cannot be directly previewed in-browser. Click below to open the source file in a new tab.
                </p>
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open {fileMeta?.originalName}
                </a>
              </div>
            </div>
          )}

          {category === 'video' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-400 tracking-wider font-semibold mb-2">Video Preview</p>
              <video
                controls
                src={mediaUrl}
                className="w-full rounded-xl border border-white/10 max-h-48"
              >
                Your browser does not support the video element.
              </video>
            </div>
          )}

          {/* AI Citation context block */}
          <div className="p-3.5 rounded-xl bg-dark-800/80 border border-white/5 space-y-1.5">
            <p className="text-[10px] uppercase text-slate-400 tracking-wider font-semibold">AI Citation Context</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              The AI Copilot referenced this source when generating its response. The content was ingested in its entirety during the multimodal synthesis phase and cross-correlated against other uploaded artifacts.
            </p>
          </div>

          {/* Open in new tab */}
          {mediaUrl && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-xs text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Raw Source File
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default SourcePreviewDrawer;
