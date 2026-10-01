import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FileUploader from '../components/FileUploader';
import InsightsDisplay from '../components/InsightsDisplay';
import ChatInterface from '../components/ChatInterface';
import SessionHistorySidebar from '../components/SessionHistorySidebar';
import axiosClient from '../api/axiosClient';
import {
  UploadCloud,
  History,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('insights'); // 'upload' or 'insights'
  const [processingStep, setProcessingStep] = useState(0);
  const [globalError, setGlobalError] = useState(null);

  const processingSteps = [
    'Securely transmitting multipart/form-data artifacts to backend...',
    'Extracting visual, acoustic, and document embeddings...',
    'Performing cross-modal correlation with Google Gemini 1.5...',
    'Finalizing diagnostic recommendations and structuring output...',
  ];

  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // Fetch past sessions on initial mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axiosClient.get('/ai/sessions');
      if (res.data?.sessions) {
        setSessions(res.data.sessions);
        // If there are sessions and no active one, load the latest
        if (res.data.sessions.length > 0 && !activeSession) {
          loadSession(res.data.sessions[0]._id);
        } else if (res.data.sessions.length === 0) {
          setViewMode('upload');
        }
      }
    } catch (err) {
      console.warn('[Fetch Sessions Notice]:', err.message);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setIsLoadingSession(true);
      setGlobalError(null);
      const res = await axiosClient.get(`/ai/sessions/${sessionId}`);
      if (res.data?.session) {
        setActiveSession(res.data.session);
        setViewMode('insights');
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.error('[Load Session Error]:', err);
      setGlobalError('Failed to load the selected session.');
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleProcessStart = async (formData) => {
    setIsProcessing(true);
    setGlobalError(null);
    setProcessingStep(0);

    // Step-by-step animation timer
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1400);

    try {
      const res = await axiosClient.post('/ai/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(interval);

      if (res.data?.session) {
        setActiveSession(res.data.session);
        setSessions((prev) => [res.data.session, ...prev]);
        setViewMode('insights');
      }
    } catch (err) {
      clearInterval(interval);
      console.error('[Processing Error]:', err);
      setGlobalError(
        err.response?.data?.message || 'Multimodal processing failed. Please check your file inputs.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await axiosClient.delete(`/ai/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      if (activeSession?._id === sessionId) {
        const remaining = sessions.filter((s) => s._id !== sessionId);
        if (remaining.length > 0) {
          loadSession(remaining[0]._id);
        } else {
          setActiveSession(null);
          setViewMode('upload');
        }
      }
    } catch (err) {
      console.error('[Delete Session Error]:', err);
      setGlobalError('Failed to delete session.');
    }
  };

  const handleMessagesUpdated = (updatedMessages) => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        messages: updatedMessages,
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col">
      {/* Navbar */}
      <Navbar onNewSession={() => setViewMode('upload')} />

      {/* Main Workspace Subheader */}
      <div className="border-b border-white/5 bg-dark-800/40 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('upload')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'upload'
                  ? 'bg-brand-cyan text-dark-900 shadow-glow-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ingest Media</span>
            </button>

            {activeSession && (
              <button
                onClick={() => setViewMode('insights')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'insights'
                    ? 'bg-brand-cyan text-dark-900 shadow-glow-cyan font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Active Case View</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Backend Status: Online</span>
            </span>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 border border-white/10 text-xs font-medium transition-colors"
            >
              <History className="w-3.5 h-3.5 text-brand-cyan" />
              <span>History ({sessions.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-rose-400 hover:text-white text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Processing Modal / Progress Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel p-8 rounded-2xl max-w-md w-full border border-brand-cyan/40 shadow-glow-cyan text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Sparkles className="w-8 h-8 text-dark-900 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Synthesizing Multimodal Knowledge</h3>
                <p className="text-xs text-slate-400 mt-1">Cross-referencing audio, visual, and textual modalities</p>
              </div>

              {/* Progress step checklist */}
              <div className="space-y-2 text-left bg-dark-800/80 p-4 rounded-xl border border-white/5">
                {processingSteps.map((step, idx) => {
                  const isDone = processingStep > idx;
                  const isCurrent = processingStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2.5 text-xs transition-colors ${
                        isDone
                          ? 'text-emerald-400 font-medium'
                          : isCurrent
                          ? 'text-brand-cyan font-bold animate-pulse'
                          : 'text-slate-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-cyan flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View Mode Switching */}
        {viewMode === 'upload' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Multimodal Ingestion & Cross-Modal Synthesis
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Upload handwritten clinical notes, doctor audio recordings, radiology scans, and laboratory PDFs for unified synthesis via Google Gemini.
              </p>
            </div>

            <FileUploader
              onProcessStart={handleProcessStart}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          /* Active Case Dual-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (60%): Synthesized Insights */}
            <div className="lg:col-span-7 space-y-6">
              {activeSession || isLoadingSession ? (
                <InsightsDisplay
                  session={activeSession}
                  isLoading={isLoadingSession}
                />
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl border border-white/10">
                  <p className="text-sm text-slate-400">No active session selected.</p>
                  <button
                    onClick={() => setViewMode('upload')}
                    className="mt-4 px-4 py-2 bg-brand-cyan text-dark-900 rounded-xl text-xs font-bold"
                  >
                    Ingest Artifacts Now
                  </button>
                </div>
              )}
            </div>

            {/* Right Column (40%): Interactive Multi-Turn Chat Copilot */}
            <div className="lg:col-span-5 sticky top-20">
              <ChatInterface
                session={activeSession}
                sessionFiles={activeSession?.files}
                onMessagesUpdated={handleMessagesUpdated}
              />
            </div>

          </div>
        )}

      </main>

      {/* History Slide-Out Drawer */}
      <SessionHistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={activeSession?._id}
        onSelectSession={loadSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
};

export default DashboardPage;
