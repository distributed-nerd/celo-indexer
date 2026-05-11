'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react'

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-96 glass-dark rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-base-blue-600 to-celo-green flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Celo AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-base-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-base-blue-500" />
                </div>
                <div className="glass p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 dark:text-gray-200">
                  Hello! I'm your Celo AI assistant. I can help you search for transactions, analyze smart contracts, or answer questions about the network. 
                  <br /><br />
                  What would you like to know today?
                </div>
              </div>
            </div>

            {/* Footer / Input */}
            <div className="p-4 border-t border-white/5 bg-slate-900/50">
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="relative"
              >
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about Celo..."
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white focus:ring-2 focus:ring-base-blue-500 transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-base-blue-600 rounded-xl hover:bg-base-blue-500 transition-colors"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-base-blue-600 hover:scale-110 active:scale-95'
        }`}
        whileHover={{ y: -5 }}
        layout
      >
        {isOpen ? (
          <X className="h-8 w-8 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-8 w-8 text-white" />
            <motion.div 
              className="absolute -top-1 -right-1 h-3 w-3 bg-celo-green rounded-full border-2 border-base-blue-600"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        )}
      </motion.button>
    </div>
  )
}
