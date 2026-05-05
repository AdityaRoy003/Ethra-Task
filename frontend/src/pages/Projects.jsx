import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, Users, ChevronRight, Search, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className="group"
  >
    <Link to={`/projects/${project.id}`} className="block h-full">
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 p-6 rounded-[2rem] hover:border-primary-500/50 hover:bg-slate-800/40 transition-all duration-300 h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 bg-primary-500/10 rounded-2xl border border-primary-500/20 group-hover:bg-primary-500/20 transition-colors">
            <Folder className="text-primary-400" size={24} />
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                U{i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white">
              +{project._count?.members || 0}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{project.name}</h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{project.description || 'No description provided for this project.'}</p>
        
        <div className="space-y-4">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Users size={14} className="text-primary-500" />
              <span>{project._count?.members || 0} Members</span>
            </div>
            <span>{project._count?.tasks || 0} Tasks</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('projects');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (project) => {
      const { data } = await api.post('projects', project);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
    },
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-64 bg-slate-900/50 animate-pulse rounded-[2rem] border border-slate-800/50" />
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Projects</h1>
          <p className="text-slate-500">Manage and collaborate on your organization's projects.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button className="p-2 bg-slate-800 text-primary-400 rounded-lg shadow-sm"><LayoutGrid size={18} /></button>
            <button className="p-2 text-slate-500 hover:text-white"><List size={18} /></button>
          </div>
          {user?.role !== 'MEMBER' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-primary-500/20 font-bold"
            >
              <Plus size={20} />
              <span>New Project</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects?.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800/50 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative z-10"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Build Something New</h2>
              <p className="text-slate-500 mb-8">Fill in the details to start your next big project.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-600"
                    placeholder="e.g. Apollo Mission"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Description</label>
                  <textarea
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-600 h-32 resize-none"
                    placeholder="Briefly describe the mission goals..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-10">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 border border-slate-700/50 rounded-2xl hover:bg-slate-800 text-slate-400 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createMutation.mutate(newProject)}
                  className="flex-1 px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20"
                >
                  Launch Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
