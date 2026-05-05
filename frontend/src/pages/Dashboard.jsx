import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-3xl border border-slate-800/50 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.08] transition-opacity`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 ')} ${color.replace('bg-', 'text-')} border border-white/5 shadow-inner`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center space-x-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">
        <ArrowUpRight size={12} />
        <span>12%</span>
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value || 0}</h3>
        <span className="text-slate-600 text-xs font-medium">this month</span>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('tasks/stats');
      return data;
    },
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-slate-900/50 animate-pulse rounded-3xl border border-slate-800/50" />
      ))}
    </div>
  );

  const chartData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 12 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 15 },
    { name: 'Sun', value: 10 },
  ];

  const pieData = [
    { name: 'Todo', value: stats?.todo || 0, color: '#64748b' },
    { name: 'In Progress', value: stats?.inProgress || 0, color: '#38bdf8' },
    { name: 'Done', value: stats?.done || 0, color: '#22c55e' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Performance Overview
        </motion.h2>
        <p className="text-slate-500">Track your team's progress and task efficiency in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Tasks" value={stats?.total} icon={ListTodo} color="bg-primary-500" delay={0.1} />
        <StatCard title="In Progress" value={stats?.inProgress} icon={Clock} color="bg-blue-400" delay={0.2} />
        <StatCard title="Completed" value={stats?.done} icon={CheckCircle2} color="bg-green-500" delay={0.3} />
        <StatCard title="Efficiency" value="94%" icon={TrendingUp} color="bg-purple-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800/50"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Task Completion Trend</h3>
            <select className="bg-slate-800 text-xs font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800/50 flex flex-col items-center justify-center text-center"
        >
          <h3 className="text-xl font-bold text-white mb-8 self-start">Status Mix</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
