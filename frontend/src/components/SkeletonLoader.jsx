import React from 'react';

/**
 * SkeletonLoader - Shimmering placeholder blocks for loading states
 * Usage:
 *   <SkeletonLoader variant="synthesis" />
 *   <SkeletonLoader variant="chat" />
 *   <SkeletonLoader lines={4} />
 */

const Line = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`skeleton ${w} ${h} rounded-lg`} />
);

export const SynthesisSkeleton = () => (
  <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 animate-fade-in">
    {/* Header */}
    <div className="space-y-3 pb-5 border-b border-white/10">
      <div className="flex items-center gap-3">
        <Line w="w-24" h="h-5" />
        <Line w="w-32" h="h-4" />
      </div>
      <Line w="w-3/4" h="h-7" />
    </div>

    {/* Executive Summary */}
    <div className="space-y-2.5 p-4 rounded-xl bg-dark-800/40 border border-white/5">
      <Line w="w-40" h="h-4" />
      <Line w="w-full" h="h-4" />
      <Line w="w-5/6" h="h-4" />
      <Line w="w-4/6" h="h-4" />
    </div>

    {/* Tab row */}
    <div className="flex gap-2 overflow-hidden">
      {['w-36','w-32','w-28','w-36'].map((w, i) => (
        <Line key={i} w={w} h="h-8" />
      ))}
    </div>

    {/* Body content */}
    <div className="space-y-3">
      {[1,2,3,4].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/5">
          <Line w="w-6" h="h-6" />
          <div className="flex-1 space-y-2">
            <Line w="w-full" h="h-3.5" />
            <Line w="w-5/6" h="h-3.5" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ChatMessageSkeleton = () => (
  <div className="flex items-start space-x-3 animate-slide-up">
    <div className="skeleton w-8 h-8 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2 p-4 rounded-2xl rounded-tl-none bg-dark-800/60 border border-white/10">
      <Line w="w-full" h="h-3.5" />
      <Line w="w-5/6" h="h-3.5" />
      <Line w="w-3/5" h="h-3.5" />
    </div>
  </div>
);

const SkeletonLoader = ({ variant = 'synthesis', lines = 3 }) => {
  if (variant === 'synthesis') return <SynthesisSkeleton />;
  if (variant === 'chat')      return <ChatMessageSkeleton />;

  return (
    <div className="space-y-2 animate-fade-in">
      {Array.from({ length: lines }).map((_, i) => (
        <Line key={i} w={i % 3 === 2 ? 'w-4/6' : 'w-full'} h="h-4" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
