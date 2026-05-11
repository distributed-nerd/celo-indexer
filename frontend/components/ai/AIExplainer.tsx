'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Info, ArrowUpRight, HelpCircle } from 'lucide-react'

interface AIExplainerProps {
  transactionType: string;
  summary: string;
  impact?: 'positive' | 'neutral' | 'negative';
}

export default function AIExplainer({ transactionType, summary, impact = 'neutral' }: AIExplainerProps) {
  const impactColors = {
    positive: 'text-green-500 bg-green-500/10',
    neutral: 'text-base-blue-500 bg-base-blue-500/10',
    negative: 'text-red-500 bg-red-500/10'
  }

  return (
    <motion.div 
      className="glass rounded-2xl border border-white/10 p-4 shadow-lg hover:shadow-xl transition-shadow group cursor-help"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-orange-400/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">AI Insight</h4>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{transactionType}</span>
              <Info className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${impactColors[impact]}`}>
          {impact}
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed indent-1 italic">
        "{summary}"
      </p>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-gray-400 font-medium">Was this helpful?</span>
        <div className="flex gap-2">
          <button className="text-[10px] font-bold text-base-blue-500 hover:opacity-80">Yes</button>
          <button className="text-[10px] font-bold text-gray-500 hover:opacity-80">No</button>
        </div>
      </div>
    </motion.div>
  )
}
