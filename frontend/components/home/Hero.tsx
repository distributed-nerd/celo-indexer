'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Code, Database, Bot } from 'lucide-react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality
    console.log('Search for:', searchQuery)
  }

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      {/* Dynamic Background gradient */}
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div 
          className="relative left-[calc(50%-11rem)] -z-10 aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#fbbf24] to-[#35d07f] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <motion.div 
              className="inline-flex items-center space-x-2 rounded-full glass px-3 py-1 text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="rounded-full bg-base-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span>Celo Indexer v2.0 is live</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </motion.div>
          </div>
          <motion.h1 
            className="mt-10 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore Celo with <span className="text-gradient">AI Power</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg font-medium leading-8 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The fastest, most intelligent way to query and visualize the Celo blockchain. 
            Search transactions, blocks, and addresses with natural language.
          </motion.p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <motion.div 
              className="w-full sm:w-auto flex-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tx, address, or block..."
                  className="rounded-2xl py-4 px-4 pl-12 w-full glass focus:ring-2 focus:ring-base-blue-500 shadow-xl transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-base-blue-500 transition-colors" />
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/indexer"
                className="w-full sm:w-auto inline-flex justify-center rounded-2xl bg-base-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-base-blue-500 hover:scale-105 transition-all duration-300"
              >
                Launch App
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <motion.div
              className="relative w-[40rem] h-[30rem] rounded-xl bg-gray-900 shadow-xl dark:ring-1 dark:ring-white/10 sm:w-[45rem]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {/* Terminal-like UI */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="flex items-center h-10 bg-gray-800 px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="text-sm text-gray-400">CeloIndexer Explorer</span>
                  </div>
                </div>
                <div className="p-6 h-[calc(100%-2.5rem)] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
                  <div className="text-green-400 mb-4">$ celoindexer --launch</div>
                  <div className="text-blue-400 mb-4">
                    <span className="text-gray-400">✓</span> Connected to Celo Mainnet
                  </div>
                  <div className="mb-4">
                    <div className="text-purple-400">» AI Agent initialized</div>
                    <div className="pl-4 text-gray-400">Ready to answer blockchain queries...</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-yellow-400">» Recent transactions:</div>
                    <div className="pl-4 text-gray-400 font-mono text-xs">
                      <div className="mb-1">0x7d21c4ea95a4bd8f0fcbe352c34ed77e91cd77c0ff12348a...</div>
                      <div className="mb-1">0x9a12b3d5f0c893e6a43d9bd36641d6c1b0963abaf1c8e2d7...</div>
                      <div>0xe4f09aa0deec5380ae9436f2978b71a4cb01c46b53455bbc...</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-cyan-400">» Command prompt:</div>
                    <div className="flex items-center pl-4 mt-1">
                      <span className="text-gray-500 mr-2">AI&gt;</span>
                      <div className="relative flex-1">
                        <span className="text-white">Tell me about the latest Celo protocol upgrade</span>
                        <span className="animate-pulse ml-1">|</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pl-4 text-gray-300">
                    <div className="text-purple-400 mb-1">» AI Response:</div>
                    <div className="pl-2 text-sm">
                      <p>The latest Celo protocol upgrade improved transaction throughput by 35% and reduced gas fees by implementing optimized batch processing. Key changes include:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                        <li>Enhanced data availability layer</li>
                        <li>New smart contract optimization engine</li>
                        <li>Improved validator coordination</li>
                      </ul>
                      <div className="mt-2">Upgrade deployment was completed on April 15, 2025.</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-green-400">$ celoindexer --query "token transfers above 100K USD in last 24h"</div>
                    <div className="mt-2 pl-4 font-mono text-xs">
                      <div className="text-gray-400">Processing query...</div>
                      <div className="text-white mt-1">Found 37 transfers matching criteria</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}