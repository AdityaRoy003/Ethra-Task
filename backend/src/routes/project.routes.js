// Project routes
import express from 'express';
import { createProject, getProjects, getProjectById, addMember } from '../controllers/project.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById);

router.post('/:projectId/members', protect, addMember);

export default router;
