import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User, Bell, Search } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="relative group">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-primary-500/10 text-primary-400' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}>
        <Icon size={20} className={isActive ? 'text-primary-400' : 'group-hover:text-white transition-colors'} />
        <span className="font-medium">{children}</span>
        {isActive && (
          <motion.div 
            layoutId="activeNav"
            className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </div>
    </Link>
  );
};

const Layout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-20">
        <div className="p-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <CheckSquare className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Ethara.
            </h1>
          </motion.div>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
          <SidebarLink to="/" icon={LayoutDashboard}>Dashboard</SidebarLink>
          <SidebarLink to="/projects" icon={FolderKanban}>Projects</SidebarLink>
          <SidebarLink to="/tasks" icon={CheckSquare}>My Tasks</SidebarLink>
        </nav>

        <div className="p-6 m-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold border border-slate-600">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all duration-300 text-sm font-medium border border-slate-700/50"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-10 bg-slate-950/50 backdrop-blur-md z-10">
          <div className="flex items-center space-x-4 bg-slate-900/50 border border-slate-800/50 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-300 placeholder-slate-600"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-950" />
            </button>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-medium group-hover:text-primary-400 transition-colors">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pro Account</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-800 p-0.5 group-hover:border-primary-500/50 transition-all">
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
