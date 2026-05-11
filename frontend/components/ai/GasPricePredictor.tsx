'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Clock, BrainCircuit, ArrowRight } from 'lucide-react';

export default function GasPricePredictor() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-3xl border border-white/10 shadow-xl overflow-hidden relative group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-base-blue-500/10 flex items-center justify-center border border-base-blue-500/20">
            <BrainCircuit className="h-5 w-5 text-base-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider italic flex items-center gap-2">
              AI Predictor
              <Sparkles className="h-3 w-3 text-orange-400" />
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">Gas Price Forecast</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Prediction Display */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 border border-white/5 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recommended Time</span>
            <div className="px-2 py-0.5 rounded-lg bg-green-500/20 border border-green-500/30">
              <span className="text-[10px] font-bold text-green-500 uppercase">Save 15%</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-white">0.12</span>
            <span className="text-sm font-bold text-gray-400">CELO</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Clock className="h-3.5 w-3.5 text-base-blue-500" />
            <span>Predicted in <span className="font-bold text-white">~12 minutes</span></span>
          </div>

          {/* Decorative AI lines */}
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingDown className="h-12 w-12 text-celo-green" strokeWidth={1} />
          </div>
        </div>

        {/* AI Insight Paragraph */}
        <div className="flex gap-3 px-1">
          <div className="h-6 w-6 rounded-lg bg-orange-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed italic">
            "Network activity is trending downwards. Waiting <span className="font-bold text-gray-900 dark:text-gray-200">12m</span> is likely to reduce your transaction cost significantly."
          </p>
        </div>

        <button className="w-full py-3 rounded-2xl bg-base-blue-600 hover:bg-base-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group shadow-lg">
          Explore Advanced Analytics
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Decorative background blur */}
      <div className="absolute -bottom-10 -right-10 h-24 w-24 bg-base-blue-500/10 blur-3xl rounded-full" />
    </motion.div>
  );
}
