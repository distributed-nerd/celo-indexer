'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class CustomErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl border border-red-500/20 p-10 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-red-500/10 blur-3xl rounded-full" />
            
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="h-10 w-10 text-red-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              We encountered an unexpected error while indexing that block. Our engineers have been notified.
            </p>

            <div className="bg-slate-900/50 p-4 rounded-2xl mb-8 border border-white/5">
              <p className="text-[10px] font-mono text-red-400 truncate">
                {this.state.error?.message || 'Unknown execution error'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-3 glass hover:bg-white/10 text-gray-700 dark:text-white rounded-2xl font-bold text-sm transition-all"
              >
                <Home className="h-4 w-4" />
                Back Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CustomErrorBoundary;
