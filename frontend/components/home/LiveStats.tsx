'use client'

import { motion } from 'framer-motion'
import { Activity, Zap, Cpu, Layers } from 'lucide-react'

const stats = [
  { name: 'Latest Block', value: '24,192,831', icon: Layers, color: 'text-blue-500' },
  { name: 'Avg Gas Price', value: '0.5 Gwei', icon: Zap, color: 'text-yellow-500' },
  { name: 'Finality', value: '5s', icon: Activity, color: 'text-green-500' },
  { name: 'Active Validators', value: '110', icon: Cpu, color: 'text-purple-500' },
]

export default function LiveStats() {
  return (
    <div className="bg-white dark:bg-slate-900 py-6 border-b border-gray-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-8 items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-linear-to-r from-base-blue-400 to-celo-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-linear-to-r from-base-blue-500 to-celo-green"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Live Network Status
            </span>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            <motion.div 
              className="flex gap-12 whitespace-nowrap"
              animate={{ x: [0, -1000] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {[...stats, ...stats, ...stats].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{stat.name}:</span>
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
