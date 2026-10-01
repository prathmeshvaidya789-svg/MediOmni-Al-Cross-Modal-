import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Pause, Trash2, CheckCircle } from 'lucide-react';

/**
 * VoiceRecorder – live browser microphone capture widget.
 * Records audio, shows animated waveform, and appends the blob
 * to the parent's file list via onRecordingComplete(blob, filename).
 */
const VoiceRecorder = ({ onRecordingComplete, disabled = false }) => {
  const [state, setState] = useState('idle'); // idle | recording | recorded
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const blobRef = useRef(null);

  /* Clean up on unmount */
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        blobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState('recorded');
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start(250); // collect every 250ms
      setState('recording');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      console.error('[VoiceRecorder] Microphone access denied:', err);
      alert('Microphone permission is required for voice recording. Please allow access and try again.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    blobRef.current = null;
    setDuration(0);
    setState('idle');
    setIsPlaying(false);
  };

  const confirmRecording = () => {
    if (!blobRef.current) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `voice-note-${timestamp}.webm`;
    onRecordingComplete(blobRef.current, filename);
    discardRecording();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Recorder Bar */}
      <div
        className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
          state === 'recording'
            ? 'bg-red-500/10 border-red-500/40'
            : state === 'recorded'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-dark-800/60 border-white/5 hover:border-white/15'
        }`}
      >
        {/* Left side: icon + status */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Pulsing mic button */}
          {state === 'idle' && (
            <button
              type="button"
              disabled={disabled}
              onClick={startRecording}
              className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/25 hover:scale-105 active:scale-95 transition-all"
              title="Start voice recording"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {state === 'recording' && (
            <button
              type="button"
              onClick={stopRecording}
              className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center animate-record-pulse hover:bg-red-600 transition-all"
              title="Stop recording"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {state === 'recorded' && (
            <button
              type="button"
              onClick={togglePlayback}
              className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/30 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Status text / waveform */}
          <div className="min-w-0">
            {state === 'idle' && (
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Record Voice Note</span>
                <span className="hidden sm:inline"> — capture spoken consultation or clinical notes</span>
              </p>
            )}
            {state === 'recording' && (
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-rose-400 font-mono">{formatDuration(duration)}</span>
                {/* Animated waveform bars */}
                <div className="flex items-end gap-0.5 h-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="wave-bar h-full" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <span className="text-[11px] text-rose-300">Recording...</span>
              </div>
            )}
            {state === 'recorded' && (
              <div>
                <p className="text-xs font-semibold text-emerald-300">Voice note ready ({formatDuration(duration)})</p>
                <p className="text-[11px] text-slate-400">Preview playback or attach to session</p>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        {state === 'recorded' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={discardRecording}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Discard"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={confirmRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-dark-900 text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Attach
            </button>
          </div>
        )}
      </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
};

export default VoiceRecorder;
