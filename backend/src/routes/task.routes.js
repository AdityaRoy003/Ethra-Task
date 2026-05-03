import express from 'express';
import { createTask, updateTask, getTasks, getDashboardStats } from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.get('/stats', protect, getDashboardStats);

router.route('/:id')
  .put(protect, updateTask);

export default router;
