import express from 'express'

const router = express.Router();

import { createTask, deleteTask, getTasks, updateTask, patchTask } from '../controllers/tasks';

router.post('/create', createTask);
router.get('/get', getTasks);
router.put('/update', updateTask);
router.patch('/patch', patchTask);
router.delete('/delete/:id', deleteTask);

export default router;