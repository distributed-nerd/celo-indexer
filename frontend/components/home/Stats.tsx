'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Database, Users, Layers, Zap } from 'lucide-react'
import { useIndexerStats } from '@/hooks/useBlockchainData'

interface StatItemProps {
  title: string
  value: string
  icon: React.ElementType
  subtitle?: string
  delay: number
}

const StatItem = ({ title, value, icon: Icon, subtitle, delay }: StatItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="mb-4 flex justify-center">
      <div className="rounded-full bg-base-blue-100 dark:bg-base-blue-900/20 p-3 text-base-blue-600 dark:text-base-blue-400">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
      {value}
    </div>
    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</div>
    {subtitle && (
      <div className="mt-2 flex items-center justify-center gap-1 text-green-500 text-sm">
        <TrendingUp className="h-4 w-4" />
        <span>{subtitle}</span>
      </div>
    )}
  </motion.div>
)

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export default function Stats() {
  const { stats, loading } = useIndexerStats()

  return (
    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-base font-semibold leading-7 text-base-blue-600 dark:text-base-blue-400"
          >
            Live Indexer Stats
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Real on-chain data, indexed live
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400"
          >
            All numbers below are pulled directly from the indexer database — no estimates.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          <StatItem
            title="Total Transfers Indexed"
            value={loading ? '…' : formatNumber(stats?.totalTransfers ?? 0)}
            icon={Zap}
            delay={0.3}
          />
          <StatItem
            title="Unique Tokens"
            value={loading ? '…' : formatNumber(stats?.uniqueTokens ?? 0)}
            icon={Database}
            delay={0.4}
          />
          <StatItem
            title="Unique Senders"
            value={loading ? '…' : formatNumber(stats?.uniqueSenders ?? 0)}
            icon={Users}
            delay={0.5}
          />
          <StatItem
            title="Latest Block"
            value={loading ? '…' : stats?.latestBlock ? formatNumber(stats.latestBlock) : 'N/A'}
            icon={Layers}
            delay={0.6}
          />
        </div>
      </div>
    </div>
  )
}
