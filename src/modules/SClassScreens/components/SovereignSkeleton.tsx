"use client";
import React from 'react';

interface SovereignSkeletonProps {
    type?: 'BENTO' | 'HEADER' | 'LIST';
    className?: string;
}

export const SovereignSkeleton = ({ type = 'BENTO', className = "" }: SovereignSkeletonProps) => {
  if (type === 'HEADER') {
    return (
      <div className={`w-full h-[300px] bg-[#050505] border border-white/10 rounded-[3.5rem] animate-pulse relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="p-12 space-y-6">
          <div className="w-48 h-2 bg-white/10 rounded-full" />
          <div className="w-96 h-16 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-[600px] bg-white/[0.03] border border-white/10 rounded-[3rem] animate-pulse relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      <div className="p-10 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-white/10 rounded-full" />
            <div className="w-48 h-2 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>
      <div className="p-10 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-white/5 rounded-[2rem]" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-[2rem]" />
      </div>
    </div>
  );
};
