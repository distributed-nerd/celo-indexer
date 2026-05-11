'use client'

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { time: '10:00', slow: 0.12, normal: 0.15, fast: 0.18 },
  { time: '11:00', slow: 0.14, normal: 0.18, fast: 0.22 },
  { time: '12:00', slow: 0.25, normal: 0.32, fast: 0.45 },
  { time: '13:00', slow: 0.20, normal: 0.25, fast: 0.30 },
  { time: '14:00', slow: 0.18, normal: 0.22, fast: 0.28 },
  { time: '15:00', slow: 0.15, normal: 0.19, fast: 0.25 },
  { time: '16:00', slow: 0.13, normal: 0.16, fast: 0.21 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4">
              <span className="text-[10px] font-medium text-white/70 capitalize">{entry.name}:</span>
              <span className="text-[10px] font-bold" style={{ color: entry.color }}>{entry.value} CELO</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function GasChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-80 glass rounded-3xl border border-white/10 p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Gas Price Trend</h3>
          <p className="text-[10px] text-gray-400 font-medium">Last 6 hours</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-celo-green/10 border border-celo-green/20">
          <span className="text-[10px] font-bold text-celo-green uppercase tracking-wide">Congestion: Low</span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              label={{ value: 'CELO', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8', fontWeight: 600 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingBottom: 20 }}
            />
            <Line 
              type="monotone" 
              dataKey="fast" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="normal" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="slow" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
