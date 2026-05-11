'use client'

import { motion } from 'framer-motion'
import { Bot, Zap, Search, MessageSquare } from 'lucide-react'

const features = [
  {
    name: 'Natural Language Queries',
    description: 'Ask questions about blockchain data just like you would to a person.',
    icon: MessageSquare,
    color: 'bg-blue-500',
  },
  {
    name: 'Intelligent Summaries',
    description: 'Get concise explanations for complex smart contract interactions.',
    icon: Bot,
    color: 'bg-purple-500',
  },
  {
    name: 'Predictive Indexing',
    description: 'AI determines the most relevant data to surface based on network trends.',
    icon: Zap,
    color: 'bg-yellow-500',
  },
]

export default function AIShowcase() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2 
            className="text-base font-semibold leading-7 text-base-blue-600 dark:text-base-blue-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Intelligence First
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Blockchain insights, simplified by AI
          </motion.p>
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Stop wrestling with complex explorer interfaces. Our AI agent understands the Celo network 
            inside and out, providing you with clear answers in seconds.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.name} 
                className="flex flex-col p-8 glass-dark rounded-3xl relative"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-base-blue-500/10 blur-3xl rounded-full" />
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
