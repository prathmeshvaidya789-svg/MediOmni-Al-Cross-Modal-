import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { ChatMessageSkeleton } from './SkeletonLoader';
import SourcePreviewDrawer from './SourcePreviewDrawer';

const SUGGESTED_QUERIES = [
  "Does the consultation audio mention any symptoms not listed in the lab PDF?",
  "What specific dosage was spoken versus written in the patient chart?",
  "Highlight any contradictions between the visual imaging and the physician notes.",
  "Formulate a brief 3-point clinical handover based on these artifacts.",
];

const ChatInterface = ({ session, onMessagesUpdated, sessionFiles = [] }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState(session?.messages || []);
  const [sending, setSending] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Fallback to session.files if sessionFiles prop wasn't passed directly
  const availableFiles = sessionFiles?.length > 0 ? sessionFiles : session?.files || [];

  useEffect(() => {
    if (session?.messages) {
      setMessages(session.messages);
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (messageToSend = inputMessage) => {
    const text = messageToSend?.trim();
    if (!text || sending || !session?._id) return;

    setInputMessage('');
    setSending(true);

    // Optimistically append user message to local state
    const optimisticUserMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const res = await axiosClient.post(`/ai/sessions/${session._id}/chat`, {
        message: text,
      });

      if (res.data?.messages) {
        setMessages(res.data.messages);
        if (onMessagesUpdated) onMessagesUpdated(res.data.messages);
      }
    } catch (err) {
      console.error('[Chat Error]:', err);
      // Append local error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Failed to get response: ${err.response?.data?.message || err.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[650px] overflow-hidden">
      
      {/* Chat Header */}
      <div className="p-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-dark-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-dark-900 shadow-glow-cyan">
            <Bot className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span>Interactive Multimodal Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Query across all {availableFiles.length} ingested media items simultaneously
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-brand-cyan border border-brand-cyan/20 bg-brand-cyan/5 px-2.5 py-1 rounded-lg">
          Gemini 1.5 Active
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-brand-cyan animate-pulse-slow" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Ask Any Question Across Ingested Sources</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Gemini will reference clinical notes, consultation audio, and radiology scans with inline citation previews.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 animate-slide-up ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                    isUser
                      ? 'bg-slate-700 text-slate-200 border border-white/10'
                      : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan/40'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-brand-blue/20 border border-brand-blue/30 text-slate-100 rounded-tr-none'
                      : 'bg-dark-800/80 border border-white/10 text-slate-200 rounded-tl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Interactive File references citation pills */}
                  {msg.fileReferences && msg.fileReferences.length > 0 && !isUser && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <FileCheck className="w-3 h-3 text-brand-cyan" />
                      <span className="text-slate-400 font-semibold">Sources:</span>
                      {msg.fileReferences.map((ref, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPreviewFile(ref)}
                          className="inline-flex items-center gap-1 bg-brand-cyan/10 hover:bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/25 hover:border-brand-cyan/50 px-2 py-0.5 rounded-md font-mono truncate max-w-[200px] transition-all cursor-pointer group"
                          title={`Click to preview ${ref}`}
                        >
                          <span className="truncate">{ref}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-400 text-right mt-1.5">
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Shimmer Skeleton during AI response generation */}
        {sending && <ChatMessageSkeleton />}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Prompt Chips */}
      <div className="p-3 bg-dark-900/50 border-t border-white/5 overflow-x-auto no-scrollbar flex items-center space-x-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 pl-1">
          Suggestions:
        </span>
        {SUGGESTED_QUERIES.map((query, i) => (
          <button
            key={i}
            onClick={() => handleSend(query)}
            disabled={sending}
            className="text-[11px] bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-white/10 px-3 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Input Field Form */}
      <div className="p-4 bg-dark-800/80 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Ask anything about the audio consultation, medical image, or PDF..."
            className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
          />

          <button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${
              sending || !inputMessage.trim()
                ? 'bg-dark-700 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-brand-cyan text-dark-900 hover:bg-cyan-300 shadow-glow-cyan'
            }`}
          >
            <Send className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>
      </div>

      {/* Slide-in Source Preview Drawer */}
      {previewFile && (
        <SourcePreviewDrawer
          file={previewFile}
          sessionFiles={availableFiles}
          onClose={() => setPreviewFile(null)}
        />
      )}

    </div>
  );
};

export default ChatInterface;
