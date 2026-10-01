import React, { useEffect } from 'react';
import { X, FileText, Music, Image as ImageIcon, Video, FileCheck, ExternalLink } from 'lucide-react';

const SourcePreviewDrawer = ({ file, sessionFiles = [], onClose }) => {
  const fileMeta = sessionFiles.find(
    (f) => f.originalName === file || f.filename === file
  );

  const getMediaUrl = (path) => {
    if (!path) return '';
    const filename = path.split('\\').pop().split('/').pop();
    return `/uploads/${filename}`;
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
    image:    'text-emerald-700 bg-emerald-50 border-emerald-200',
    audio:    'text-sky-700 bg-sky-50 border-sky-200',
    document: 'text-teal-700 bg-teal-50 border-teal-200',
    video:    'text-indigo-700 bg-indigo-50 border-indigo-200',
  }[category] || 'text-slate-700 bg-slate-50 border-slate-200';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col"
        style={{ animation: 'slideInLeft 0.28s cubic-bezier(0.4,0,0.2,1) both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${categoryColor}`}>
              <CategoryIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{fileMeta?.originalName || file}</p>
              <p className="text-[10px] font-mono uppercase font-semibold text-slate-500">
                {category} · {fileMeta ? `${(fileMeta.size / 1024 / 1024).toFixed(2)} MB` : 'Reference'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!fileMeta && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              Source metadata is not directly previewable in this view.
            </div>
          )}

          {category === 'image' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold mb-2">Image / Radiology Preview</p>
              <img
                src={mediaUrl}
                alt={fileMeta?.originalName}
                className="w-full rounded-2xl border border-slate-200 object-contain max-h-64 shadow-xs"
              />
            </div>
          )}

          {category === 'audio' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold mb-2">Consultation Audio Playback</p>
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs">
                <audio controls className="w-full" src={mediaUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Recorded consultation audio referenced by the clinical copilot.
              </p>
            </div>
          )}

          {category === 'document' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold mb-2">Pathology / Document Source</p>
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-3 shadow-xs">
                <p className="text-xs text-teal-950 font-medium">
                  PDF documents are parsed for entities and values. Click below to view the original report.
                </p>
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open {fileMeta?.originalName}
                </a>
              </div>
            </div>
          )}

          {category === 'video' && mediaUrl && (
            <div className="animate-fade-in">
              <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold mb-2">Video Preview</p>
              <video
                controls
                src={mediaUrl}
                className="w-full rounded-2xl border border-slate-200 max-h-48 shadow-xs"
              >
                Your browser does not support the video element.
              </video>
            </div>
          )}

          {/* AI Citation context block */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 shadow-xs">
            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">Clinical Citation Context</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              The AI Copilot correlated this source with diagnostic features and consultation cues during the multimodal synthesis phase.
            </p>
          </div>

          {/* Open in new tab */}
          {mediaUrl && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
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
