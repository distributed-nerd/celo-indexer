'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Edit2, Check, X, Plus } from 'lucide-react';

interface AddressTaggingProps {
  address: string;
  initialTag?: string;
  onTagChange: (tag: string) => void;
}

export default function AddressTagging({ address, initialTag = '', onTagChange }: AddressTaggingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tag, setTag] = useState(initialTag);
  const [pendingTag, setPendingTag] = useState(initialTag);

  const handleSave = () => {
    setTag(pendingTag);
    onTagChange(pendingTag);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPendingTag(tag);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div 
            key="editing"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-white/20 shadow-md"
          >
            <input 
              type="text" 
              value={pendingTag}
              onChange={(e) => setPendingTag(e.target.value)}
              placeholder="Give this address a name..."
              className="bg-transparent border-none focus:ring-0 text-xs text-gray-700 dark:text-gray-200 w-40 font-bold placeholder:text-gray-400 placeholder:font-normal"
              autoFocus
            />
            <button onClick={handleSave} className="p-1 hover:bg-celo-green/20 rounded-lg transition-colors">
              <Check className="h-3 w-3 text-celo-green" />
            </button>
            <button onClick={handleCancel} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
              <X className="h-3 w-3 text-red-500" />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="display"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group flex items-center gap-2"
          >
            {tag ? (
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-base-blue-500/20 bg-base-blue-500/5 shadow-sm">
                <Tag className="h-3 w-3 text-base-blue-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{tag}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <Edit2 className="h-3 w-3 text-gray-400" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 hover:border-base-blue-500 hover:bg-base-blue-500/5 transition-all group/btn"
              >
                <Plus className="h-3 w-3 text-gray-400 group-hover/btn:text-base-blue-500" />
                <span className="text-xs font-bold text-gray-400 group-hover/btn:text-base-blue-500">Label Address</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
