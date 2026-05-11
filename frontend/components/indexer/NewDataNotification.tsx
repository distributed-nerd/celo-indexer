// src/components/indexer/NewDataNotification.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';

interface NewDataNotificationProps {
  isVisible: boolean;
  onRefresh: () => void;
  dataType?: string;
}

export default function NewDataNotification({ 
  isVisible, 
  onRefresh, 
  dataType = 'data' 
}: NewDataNotificationProps) {
  const [animatedDot, setAnimatedDot] = useState(false);

  // Animate the dot every 2 seconds
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setAnimatedDot(prev => !prev);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="glass rounded-2xl p-1 mb-6 flex items-center justify-between border border-white/20 shadow-lg ring-1 ring-base-blue-500/10"
        >
          <div className="flex items-center pl-3">
            <span className="relative flex h-2 w-2 mr-3">
              <motion.span 
                animate={{ 
                  scale: animatedDot ? 1.5 : 1,
                  opacity: animatedDot ? 0.8 : 0.4
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-base-blue-500 opacity-75"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-base-blue-600" />
            </span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
              New {dataType} detected on-chain
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2 bg-base-blue-600 hover:bg-base-blue-500 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh View
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}