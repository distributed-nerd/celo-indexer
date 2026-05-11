'use client'

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign } from 'lucide-react';

const data = [
  { date: 'Jan', value: 1250 },
  { date: 'Feb', value: 1400 },
  { date: 'Mar', value: 1350 },
  { date: 'Apr', value: 1800 },
  { date: 'May', value: 2100 },
  { date: 'Jun', value: 1950 },
  { date: 'Jul', value: 2400 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-celo-green">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function AssetValueHistory() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-80 glass rounded-3xl border border-white/10 p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-celo-green/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-celo-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Asset Value History</h3>
            <p className="text-[10px] text-gray-400 font-medium">Estimated USD Portfolio Value</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-celo-green">$2,400.00</span>
          <span className="text-[10px] text-green-500 font-bold">+18.2% vs last month</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#35D07F" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#35D07F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#35D07F" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
