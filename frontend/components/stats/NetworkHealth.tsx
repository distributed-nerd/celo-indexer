'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Pulse, Globe, RefreshCcw } from 'lucide-react';

export default function NetworkHealth() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl border border-white/10 shadow-xl overflow-hidden relative group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-celo-green/10 flex items-center justify-center border border-celo-green/20">
            <ShieldCheck className="h-5 w-5 text-celo-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Network Health</h3>
            <p className="text-[10px] text-gray-400 font-medium">Mainnet Status</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-sm font-bold text-gray-900 dark:text-white">99.99%</span>
            <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none">Uptime</span>
          </div>
          <RefreshCcw className="h-4 w-4 text-gray-400 animate-spin-slow cursor-pointer hover:text-base-blue-500 transition-colors" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Pulse */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-celo-green" />
              <div className="absolute inset-0 h-3 w-3 rounded-full bg-celo-green animate-ping opacity-75" />
            </div>
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wide">Operational</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400">#42,928,102</span>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-base-blue-500/5 border border-base-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-3 w-3 text-base-blue-500" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Avg Latency</span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">142ms</p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-3 w-3 text-orange-500" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Region</span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Global Cluster</p>
          </div>
        </div>
      </div>

      {/* Decorative pulse glow */}
      <div className="absolute -top-10 -left-10 h-32 w-32 bg-celo-green/5 blur-3xl rounded-full" />
    </motion.div>
  );
}
