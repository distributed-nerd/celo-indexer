'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, FileText, Send, ShoppingCart } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'incoming' | 'outgoing' | 'contract' | 'deployment';
  amount: string;
  asset: string;
  timestamp: string;
  hash: string;
  counterparty?: string;
}

const mockTimeline: TimelineItem[] = [
  { id: '1', type: 'outgoing', amount: '25.00', asset: 'CELO', timestamp: '2 mins ago', hash: '0x123...abc', counterparty: '0xabc...123' },
  { id: '2', type: 'incoming', amount: '100.00', asset: 'cUSD', timestamp: '1 hour ago', hash: '0x456...def', counterparty: 'Exchange' },
  { id: '3', type: 'contract', amount: '0.00', asset: 'Interaction', timestamp: '3 hours ago', hash: '0x789...ghi', counterparty: 'Ubeswap Pool' },
  { id: '4', type: 'deployment', amount: '2.50', asset: 'CELO Fee', timestamp: '1 day ago', hash: '0xa1b...c2d' },
];

export default function TransactionTimeline() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'outgoing': return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'incoming': return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'contract': return <FileText className="h-4 w-4 text-base-blue-500" />;
      case 'deployment': return <ShoppingCart className="h-4 w-4 text-orange-500" />;
      default: return <Send className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-linear-to-b before:from-base-blue-500 before:via-celo-green before:to-transparent">
      {mockTimeline.map((item, idx) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-base-blue-500 z-10 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>

          <div className="glass rounded-3xl border border-white/10 p-5 shadow-lg group-hover:shadow-xl transition-all hover:bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-white/5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 capitalize">{item.type}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.type === 'outgoing' ? '-' : item.type === 'incoming' ? '+' : ''}
                  {item.amount} {item.asset}
                </p>
                <p className="text-[10px] font-mono text-base-blue-500">{item.hash}</p>
              </div>
            </div>
            
            {item.counterparty && (
              <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/40 border border-white/5 max-w-max">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">To/From:</span>
                <span className="text-[10px] font-mono text-gray-200">{item.counterparty}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
