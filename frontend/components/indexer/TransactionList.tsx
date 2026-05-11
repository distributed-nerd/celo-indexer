'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Hash, Clock, Coins } from 'lucide-react';

const mockTxs = [
  { hash: '0x123...abc', from: '0xabc...123', to: '0xdef...456', value: '1.25', time: '12s ago', status: 'success' },
  { hash: '0x456...def', from: '0xdef...456', to: '0xghi...789', value: '45.00', time: '45s ago', status: 'success' },
  { hash: '0x789...ghi', from: '0xghi...789', to: '0xabc...123', value: '0.05', time: '1m ago', status: 'pending' },
  { hash: '0xabc...123', from: '0x123...abc', to: '0xdef...456', value: '10.50', time: '3m ago', status: 'failed' },
];

export default function TransactionList() {
  return (
    <div className="space-y-3">
      {mockTxs.map((tx, idx) => (
        <motion.div
          key={tx.hash}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="glass rounded-2xl border border-white/5 p-4 flex items-center justify-between hover:bg-white/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border border-white/5 ${
              tx.status === 'success' ? 'bg-green-500/10 text-green-500' : 
              tx.status === 'pending' ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 
              'bg-red-500/10 text-red-500'
            }`}>
              {tx.value > '5' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{tx.hash}</span>
                <div className={`h-1.5 w-1.5 rounded-full ${
                  tx.status === 'success' ? 'bg-green-500' : 
                  tx.status === 'pending' ? 'bg-blue-500' : 
                  'bg-red-500'
                }`} />
              </div>
              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> From {tx.from}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {tx.time}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{tx.value}</span>
              <Coins className="h-4 w-4 text-celo-green" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">CELO Balance</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}