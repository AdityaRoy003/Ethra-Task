import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const { data: updatedUser } = await api.put('auth/me', data);
      return updatedUser;
    },
    onSuccess: (data) => {
      setUser({ ...user, ...data });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    const updateData = {
      name: formData.name,
      email: formData.email,
    };
    if (formData.password) updateData.password = formData.password;
    
    updateMutation.mutate(updateData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-500">Manage your account settings and personal information.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-8 rounded-[2.5rem] flex flex-col items-center text-center sticky top-24">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary-600 to-primary-400 p-1 flex items-center justify-center shadow-2xl shadow-primary-500/20">
                <div className="w-full h-full rounded-[1.25rem] bg-slate-900 flex items-center justify-center text-4xl font-bold text-white uppercase tracking-tighter">
                  {user?.name?.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg">
                <Shield size={18} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-primary-500 text-sm font-bold uppercase tracking-widest mb-6">{user?.role} Account</p>
            
            <div className="w-full space-y-4 pt-6 border-t border-slate-800/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="text-green-400 font-bold flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span>Online</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Joined</span>
                <span className="text-slate-300 font-bold">May 2026</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Update Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-10 rounded-[2.5rem]">
            <form onSubmit={handleSubmit} className="space-y-8">
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center space-x-2 p-4 rounded-2xl border ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span className="text-sm font-bold">{message.text}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/50">
                <h3 className="text-lg font-bold text-white mb-6">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-500 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        className="w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                >
                  {updateMutation.isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Save size={20} />
                  )}
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
