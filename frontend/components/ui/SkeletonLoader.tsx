'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const shimmer = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height, rounded = 'md' }) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  return (
    <div 
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        variants={shimmer}
        initial="initial"
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 dark:via-white/5 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      />
    </div>
  );
};

export const TableSkeleton = () => (
  <div className="space-y-4 w-full">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-white/5">
        <Skeleton width="40px" height="40px" rounded="2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="12px" />
          <Skeleton width="40%" height="8px" />
        </div>
        <Skeleton width="80px" height="24px" rounded="xl" />
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton width="40px" height="40px" rounded="2xl" />
      <div className="space-y-2">
        <Skeleton width="100px" height="12px" />
        <Skeleton width="60px" height="8px" />
      </div>
    </div>
    <Skeleton width="100%" height="120px" rounded="2xl" />
    <div className="flex justify-between">
      <Skeleton width="80px" height="10px" />
      <Skeleton width="100px" height="10px" />
    </div>
  </div>
);
