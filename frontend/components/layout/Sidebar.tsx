'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  BarChart2, 
  Layout, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Database,
  Shield,
  Activity
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Explorer', icon: Search, href: '/explorer' },
  { name: 'Network Stats', icon: Activity, href: '/stats' },
  { name: 'Transactions', icon: Database, href: '/transactions' },
  { name: 'Node Status', icon: Shield, href: '/node' },
  { name: 'Analytics', icon: BarChart2, href: '/analytics' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="relative h-screen bg-slate-50 dark:bg-slate-900 border-r border-gray-200 dark:border-white/5 flex flex-col transition-all duration-300 ease-in-out"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-base-blue-600 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header / Logo Section */}
      <div className="p-6 mb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 flex-shrink-0 rounded-2xl bg-linear-to-br from-base-blue-500 to-celo-green flex items-center justify-center shadow-lg shadow-base-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap"
              >
                Celo<span className="text-base-blue-500">Indexer</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`
                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-base-blue-600 text-white shadow-lg shadow-base-blue-500/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }
              `}>
                <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-base-blue-500 transition-colors'} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-bold whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Profile / Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/2 backdrop-blur-md">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-400 to-slate-600 border-2 border-white/20 overflow-hidden shadow-md">
            <div className="w-full h-full bg-base-blue-500/20 flex items-center justify-center">
              <Settings size={18} className="text-white" />
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Admin Account</p>
                <p className="text-[10px] text-gray-500 font-medium truncate uppercase tracking-widest">Mainnet Access</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
