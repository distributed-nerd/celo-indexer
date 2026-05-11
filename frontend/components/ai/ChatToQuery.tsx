'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Terminal, CheckCircle2, ArrowRight } from 'lucide-react'

interface ChatToQueryProps {
  naturalLanguage: string;
  generatedQuery: string;
  explanation: string;
}

export default function ChatToQuery({ naturalLanguage, generatedQuery, explanation }: ChatToQueryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-3xl border border-white/10 overflow-hidden shadow-xl"
    >
      <div className="p-5 border-b border-white/5 bg-slate-900/40">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="h-4 w-4 text-base-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Natural Language Input</span>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 indent-2 italic">
          "{naturalLanguage}"
        </p>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-celo-green" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Generated Query</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl font-mono text-xs text-base-blue-400 border border-white/5 relative group">
            <code>{generatedQuery}</code>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle2 className="h-4 w-4 text-celo-green" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-base-blue-500/5 border border-base-blue-500/10">
          <div className="h-6 w-6 rounded-lg bg-base-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-base-blue-500 underline">AI</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
            {explanation}
          </p>
        </div>

        <button className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group">
          Execute this query
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}
