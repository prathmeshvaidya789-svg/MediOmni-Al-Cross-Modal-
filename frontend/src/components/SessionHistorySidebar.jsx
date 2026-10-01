import React from 'react';
import { Clock, Trash2, FolderOpen, Activity } from 'lucide-react';

const SessionHistorySidebar = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-80 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: '#FFFFFF',
          borderLeft: '1px solid #E2E8F0',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#EFF6FF' }}
            >
              <Clock className="w-3.5 h-3.5" style={{ color: '#0284C7' }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: '#0F172A' }}>
              Session History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: '#F1F5F9',
              color: '#64748B',
              border: '1px solid #E2E8F0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            Close
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: '#F0F9FF' }}
              >
                <FolderOpen className="w-6 h-6" style={{ color: '#0284C7' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#374151' }}>
                No sessions yet
              </p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                Upload files to start your first case.
              </p>
            </div>
          ) : (
            sessions.map((item) => {
              const isSelected = item._id === currentSessionId;
              return (
                <div
                  key={item._id}
                  onClick={() => onSelectSession(item._id)}
                  className="p-3 rounded-xl cursor-pointer transition-all group flex items-start justify-between"
                  style={{
                    background: isSelected ? '#EFF6FF' : '#F8FAFC',
                    border: isSelected ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                    boxShadow: isSelected ? '0 2px 8px rgba(2,132,199,0.12)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#F0F9FF';
                      e.currentTarget.style.borderColor = '#BAE6FD';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }
                  }}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wide"
                        style={{
                          background: isSelected ? '#DBEAFE' : '#F1F5F9',
                          color: isSelected ? '#0284C7' : '#64748B',
                        }}
                      >
                        {item.domain || 'Health'}
                      </span>
                      <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                        {new Date(item.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h4
                      className="text-xs font-semibold truncate"
                      style={{ color: isSelected ? '#0284C7' : '#1E293B' }}
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Activity className="w-3 h-3" style={{ color: '#94A3B8' }} />
                      <p className="text-[11px]" style={{ color: '#94A3B8' }}>
                        {item.files?.length || 0} files · {item.status}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this session?')) {
                        onDeleteSession(item._id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all"
                    style={{ color: '#94A3B8' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FEE2E2';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94A3B8';
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 text-center text-[11px]"
          style={{ borderTop: '1px solid #E2E8F0', color: '#94A3B8' }}
        >
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </div>
      </div>
    </>
  );
};

export default SessionHistorySidebar;
