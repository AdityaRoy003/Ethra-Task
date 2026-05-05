import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Clock, ListTodo, UserPlus, Calendar, MoreVertical, MessageSquare } from 'lucide-react';

const TaskCard = ({ task, onUpdateStatus, currentUser }) => {
  const canUpdate = currentUser?.role === 'ADMIN' || 
                    currentUser?.role === 'MANAGER' || 
                    task.assigneeId === currentUser?.id;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="bg-slate-900 border border-slate-800/50 p-5 rounded-2xl shadow-sm group"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-200 group-hover:text-primary-400 transition-colors">{task.title}</h4>
        <button className="text-slate-600 hover:text-white transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>
      
      <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-primary-400">
            {task.assignee?.name?.charAt(0) || '?'}
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-slate-600">
          <div className="flex items-center space-x-1">
            <MessageSquare size={14} />
            <span className="text-[10px] font-bold">2</span>
          </div>
          <select
            className={`bg-slate-800/50 border-none text-[10px] font-bold uppercase tracking-widest text-primary-500 rounded-lg px-2 py-1 outline-none ${!canUpdate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            value={task.status}
            onChange={(e) => canUpdate && onUpdateStatus({ taskId: task.id, status: e.target.value })}
            disabled={!canUpdate}
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '', dueDate: '' });

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await api.get(`projects/${id}`);
      return data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task) => {
      const { data } = await api.post('tasks', { ...task, projectId: id });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', assigneeId: '', dueDate: '' });
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const { data } = await api.put(`tasks/${taskId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
    },
  });

  if (isLoading) return <div className="p-10 animate-pulse bg-slate-900/50 rounded-[2.5rem] h-96" />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-primary-500/10 text-primary-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary-500/20">
              Active Project
            </span>
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1">
              <Calendar size={12} />
              <span>Started {new Date(project.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{project?.name}</h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">{project?.description}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {project?.members?.map((m, i) => (
              <div key={i} title={m.user.name} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                {m.user.name.charAt(0)}
              </div>
            ))}
            <button className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-primary-500/10 hover:text-primary-500 transition-colors">
              <UserPlus size={18} />
            </button>
          </div>
          {currentUser?.role !== 'MEMBER' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-primary-500/20 font-bold"
            >
              <Plus size={20} />
              <span>Add Task</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
          <div key={status} className="bg-slate-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-800/50 flex flex-col h-full min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'DONE' ? 'bg-green-500' : 
                  status === 'IN_PROGRESS' ? 'bg-primary-500' : 'bg-slate-600'
                }`} />
                <span>{status.replace('_', ' ')}</span>
              </h3>
              <span className="bg-slate-800/50 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                {project?.tasks?.filter(t => t.status === status).length || 0}
              </span>
            </div>
            
            <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence>
                {project?.tasks?.filter(t => t.status === status).map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdateStatus={updateTaskStatusMutation.mutate} 
                    currentUser={currentUser}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[100]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-slate-900 border border-slate-800/50 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2">Create Task</h2>
              <p className="text-slate-500 mb-8">Assign a new task to your team member.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Title</label>
                  <input type="text" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white" placeholder="Task title..." value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Description</label>
                  <textarea className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none h-24 text-white" placeholder="What needs to be done?" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Assignee</label>
                  <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-white appearance-none cursor-pointer" value={newTask.assigneeId} onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}>
                    <option value="">Select Team Member</option>
                    {project?.members?.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-10">
                <button onClick={() => setIsTaskModalOpen(false)} className="flex-1 px-6 py-4 border border-slate-700/50 rounded-2xl hover:bg-slate-800 text-slate-400 font-bold transition-colors">Cancel</button>
                <button onClick={() => createTaskMutation.mutate(newTask)} className="flex-1 px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20">Create Task</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
