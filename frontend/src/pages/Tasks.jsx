import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, ListTodo, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('tasks');
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const { data } = await api.put(`tasks/${taskId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  if (isLoading) return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-20 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800/50" />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Task Assignments</h1>
          <p className="text-slate-500">Track and manage your individual responsibilities across all projects.</p>
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors text-sm font-medium text-slate-300">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
      
      <div className="bg-slate-900/40 backdrop-blur-sm rounded-[2rem] border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Task Details</th>
                <th className="px-8 py-6">Associated Project</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence mode="popLayout">
                {tasks?.map((task, index) => (
                  <motion.tr 
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200 group-hover:text-primary-400 transition-colors mb-1">{task.title}</span>
                        <span className="text-xs text-slate-500 line-clamp-1">{task.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Link to={`/projects/${task.projectId}`} className="inline-flex items-center space-x-2 text-slate-400 hover:text-primary-400 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        <span className="text-sm font-medium">{task.project?.name}</span>
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                        task.status === 'DONE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        task.status === 'IN_PROGRESS' ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' :
                        'bg-slate-700/10 text-slate-500 border-slate-700/20'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {(() => {
                        const canUpdate = currentUser?.role === 'ADMIN' || 
                                          currentUser?.role === 'MANAGER' || 
                                          task.assigneeId === currentUser?.id;
                        return (
                          <select
                            className={`bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold uppercase tracking-widest text-primary-500 rounded-xl px-3 py-2 outline-none ${!canUpdate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            value={task.status}
                            onChange={(e) => canUpdate && updateStatusMutation.mutate({ taskId: task.id, status: e.target.value })}
                            disabled={!canUpdate}
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">Progress</option>
                            <option value="DONE">Completed</option>
                          </select>
                        );
                      })()}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {tasks?.length === 0 && (
            <div className="p-20 text-center">
              <div className="bg-slate-800/50 inline-flex p-6 rounded-3xl mb-4">
                <ListTodo size={48} className="text-slate-600" />
              </div>
              <p className="text-slate-500 font-medium">No tasks assigned to you yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
