import express from 'express'
import auth from '../middleware/auth';

const router = express.Router();

import { createTask, deleteTask, getTasks, updateTask, patchTasks } from '../controllers/tasksController';

router.post('/create', auth, createTask);
router.get('/get', auth, getTasks);
router.put('/update', auth, updateTask);
router.patch('/patch', auth, patchTasks);
router.delete('/delete/:id', auth, deleteTask);

export default router;