import React from 'react';
import {
  Clock,
  Trash2,
  ChevronRight,
  FolderOpen,
  Sparkles,
  FileText,
  Activity,
} from 'lucide-react';

const SessionHistorySidebar = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-dark-900/95 backdrop-blur-2xl border-l border-white/10 p-6 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Case Ingestion History
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-dark-800 border border-white/10"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No previous sessions recorded. Upload files to start your first case.
          </div>
        ) : (
          sessions.map((item) => {
            const isSelected = item._id === currentSessionId;
            return (
              <div
                key={item._id}
                onClick={() => onSelectSession(item._id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between group ${
                  isSelected
                    ? 'bg-brand-cyan/15 border-brand-cyan/50 text-white shadow-glow-cyan/20'
                    : 'bg-dark-800/60 border-white/5 text-slate-300 hover:bg-dark-800 hover:border-white/15'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-dark-700 text-brand-cyan">
                      {item.domain || 'Health'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-brand-cyan transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.files?.length || 0} files · {item.status}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this multimodal session?')) {
                      onDeleteSession(item._id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SessionHistorySidebar;
