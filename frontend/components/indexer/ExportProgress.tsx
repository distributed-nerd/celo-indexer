'use client'

import { motion } from 'framer-motion'
import { FileCheck, Download, Loader2, X } from 'lucide-react'

interface ExportProgressProps {
  progress: number;
  isExporting: boolean;
  filename?: string;
  onClose: () => void;
}

export default function ExportProgress({ progress, isExporting, filename, onClose }: ExportProgressProps) {
  if (!isExporting && progress === 0) return null;

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50 w-80 glass shadow-2xl rounded-3xl border border-white/20 p-6 overflow-hidden"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {progress < 100 ? (
            <div className="h-10 w-10 rounded-2xl bg-base-blue-500/10 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-base-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-green-500" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {progress < 100 ? 'Exporting Data...' : 'Export Complete'}
            </h4>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              {filename || 'blockchain-data.csv'}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-linear-to-r from-base-blue-500 to-celo-green rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
          {progress < 100 ? `${progress}% Processed` : 'Ready for download'}
        </span>
        {progress === 100 && (
          <button className="flex items-center gap-1 text-[10px] font-bold text-base-blue-500 hover:underline">
            <Download className="h-3 w-3" />
            Download Now
          </button>
        )}
      </div>

      {/* Decorative background blur */}
      <div className="absolute -top-10 -right-10 h-32 w-32 bg-base-blue-500/5 blur-3xl -z-10 rounded-full" />
    </motion.div>
  )
}
