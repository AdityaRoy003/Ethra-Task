import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, ArrowRight, User, Mail, Lock, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800/50 shadow-2xl relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex p-4 bg-primary-500/10 rounded-2xl border border-primary-500/20 mb-6"
          >
            <CheckSquare className="text-primary-500" size={32} />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Join the Mission</h2>
          <p className="text-slate-500 font-medium">Start collaborating with your team today.</p>
        </div>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl text-center font-medium"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-3.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-600"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-3.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-3.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-600"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Access Role</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                <select
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-10 py-3.5 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="MEMBER">Team Member</option>
                  <option value="ADMIN">System Admin</option>
                </select>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 rotate-90" size={16} />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group relative w-full flex items-center justify-center space-x-2 py-4 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/25 mt-4"
          >
            <span>Create Account</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
