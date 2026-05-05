import prisma from '../lib/prisma.js';

export const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (req.user.role === 'MEMBER') {
    return res.status(403).json({ message: 'Only Admins and Managers can create projects' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
      },
    });

    // Automatically add owner as a member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: req.user.id,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        owner: {
          select: { name: true, email: true },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        tasks: {
          include: {
            assignee: { select: { name: true } },
          },
        },
      },
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is a member
    const isMember = project.members.some((m) => m.userId === req.user.id);
    if (!isMember && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.ownerId !== req.user.id && req.user.role === 'MEMBER') {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
      },
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
