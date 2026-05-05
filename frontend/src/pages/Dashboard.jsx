import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar 
} from 'recharts';
import { 
  CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, 
  Users, ArrowUpRight, BarChart3, Activity, Zap, Search,
  Filter, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, delay, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/50 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.08] transition-opacity`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 ')} ${color.replace('bg-', 'text-')} border border-white/5 shadow-inner`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'} text-xs font-bold px-2 py-1 rounded-full`}>
          <ArrowUpRight size={12} className={trend < 0 ? 'rotate-90' : ''} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value || 0}</h3>
        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">Current</span>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data } = await api.get('tasks/stats');
      return data;
    },
  });

  const { data: projectStats, isLoading: projectsLoading } = useQuery({
    queryKey: ['project-stats'],
    queryFn: async () => {
      const { data } = await api.get('tasks/project-stats');
      return data;
    },
  });

  const { data: recentTasks } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: async () => {
      const { data } = await api.get('tasks');
      return data.slice(0, 5);
    },
  });

  if (statsLoading || projectsLoading) return (
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
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white tracking-tight mb-2"
          >
            Welcome Back! 👋
          </motion.h2>
          <p className="text-slate-500 font-medium">Here's what's happening with your projects today.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          {['7d', '30d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                timeRange === range 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats?.total} icon={ListTodo} color="bg-primary-500" delay={0.1} trend={12} />
        <StatCard title="In Progress" value={stats?.inProgress} icon={Clock} color="bg-blue-400" delay={0.2} trend={5} />
        <StatCard title="Completed" value={stats?.done} icon={CheckCircle2} color="bg-green-500" delay={0.3} trend={18} />
        <StatCard title="Overdue" value={stats?.overdue} icon={AlertCircle} color="bg-red-500" delay={0.4} trend={-8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Productivity Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/50"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Productivity Score</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <Calendar size={14} />
                <span>Last 7 Days</span>
              </div>
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
                    cursor={{ stroke: '#334155', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Project Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/50"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Project Distribution</h3>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  />
                  <Bar dataKey="tasks" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Status Mix (Pie) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/50 flex flex-col items-center"
          >
            <h3 className="text-xl font-bold text-white mb-8 self-start flex items-center space-x-3">
              <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
                <Zap size={20} />
              </div>
              <span>Status Mix</span>
            </h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
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
            <div className="grid grid-cols-1 gap-3 w-full mt-6">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                <div className="p-2.5 bg-primary-500/10 rounded-xl text-primary-400 border border-primary-500/20">
                  <Activity size={20} />
                </div>
                <span>Recent Tasks</span>
              </h3>
            </div>
            <div className="space-y-4">
              {recentTasks?.map((task, i) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 rounded-2xl transition-all cursor-pointer group">
                  <div className={`w-2 h-10 rounded-full ${
                    task.status === 'DONE' ? 'bg-green-500' : 
                    task.status === 'IN_PROGRESS' ? 'bg-primary-500' : 'bg-slate-600'
                  }`} />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-primary-400 transition-colors">{task.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{task.project?.name}</p>
                  </div>
                </div>
              ))}
              <Link to="/tasks" className="block text-center text-xs font-bold text-primary-500 hover:text-primary-400 transition-colors mt-4 uppercase tracking-[0.2em]">
                View All Tasks
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
