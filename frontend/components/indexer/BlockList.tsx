'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Box, Cpu, Zap, Activity } from 'lucide-react';

const mockBlocks = [
  { number: '42,928,102', txs: '142', gas: '78%', time: '2s ago', validator: 'Celo Foundation' },
  { number: '42,928,101', txs: '89', gas: '45%', time: '7s ago', validator: 'Deutsche Telekom' },
  { number: '42,928,100', txs: '256', gas: '92%', time: '12s ago', validator: 'Figment' },
  { number: '42,927,999', txs: '12', gas: '5%', time: '17s ago', validator: 'Celo Foundation' },
];

export default function BlockList() {
  return (
    <div className="space-y-4">
      {mockBlocks.map((block, idx) => (
        <motion.div
          key={block.number}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="glass rounded-3xl border border-white/10 p-5 flex items-center justify-between hover:bg-white/5 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-base-blue-600/10 flex items-center justify-center border border-base-blue-600/20 group-hover:bg-base-blue-600 group-hover:text-white transition-all">
              <Box className="h-6 w-6 text-base-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight">#{block.number}</h4>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> {block.validator}</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {block.txs} Txs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3 w-3 text-orange-400" />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Gas Usage</span>
              </div>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: block.gas }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-base-blue-500"
                />
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs font-bold text-gray-900 dark:text-white">{block.time}</span>
              <div className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-white/5 mt-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Confirmed</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}