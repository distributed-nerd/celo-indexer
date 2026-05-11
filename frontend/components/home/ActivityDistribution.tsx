'use client'

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Transfers', value: 45, color: '#3b82f6' },
  { name: 'Smart Contracts', value: 30, color: '#10b981' },
  { name: 'Governance', value: 15, color: '#f59e0b' },
  { name: 'Staking', value: 10, color: '#ef4444' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].value}% of activity
        </p>
      </div>
    );
  }
  return null;
};

export default function ActivityDistribution() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-80 glass rounded-3xl border border-white/10 p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Activity Distribution</h3>
          <p className="text-[10px] text-gray-400 font-medium">Network breakdown</p>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={2000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              iconType="circle"
              wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 20 }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Central Overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-[45%] flex flex-col items-center pointer-events-none">
          <span className="text-xl font-bold text-gray-900 dark:text-white">100%</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">Utility</span>
        </div>
      </div>
    </motion.div>
  );
}
