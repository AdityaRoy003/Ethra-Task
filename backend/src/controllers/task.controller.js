import prisma from '../lib/prisma.js';

export const createTask = async (req, res) => {
  const { title, description, status, dueDate, projectId, assigneeId } = req.body;

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isAuthorized = project.ownerId === req.user.id || req.user.role !== 'MEMBER';
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to create tasks in this project' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, assigneeId } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAuthorized = req.user.role !== 'MEMBER' || 
                         task.project.ownerId === req.user.id ||
                         task.assigneeId === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const { projectId } = req.query;

  try {
    const where = {};
    if (projectId) where.projectId = projectId;
    else {
      // If no project specified, get tasks assigned to user or in projects user belongs to
      where.OR = [
        { assigneeId: req.user.id },
        { project: { members: { some: { userId: req.user.id } } } }
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assigneeId: req.user.id },
          { project: { ownerId: req.user.id } }
        ]
      }
    });

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: tasks.filter(t => t.status === 'DONE').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { userId: req.user.id } } }
        ]
      },
      select: {
        name: true,
        _count: {
          select: { tasks: true }
        }
      }
    });

    const data = projects.map(p => ({
      name: p.name,
      tasks: p._count.tasks
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
