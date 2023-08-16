import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv  from 'dotenv';

import { connectDB } from './db';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';

dotenv.config();

const PROD_CLIENTS = [
    'https://tasks-app-la.onrender.com',
    'https://tasks-app-wth-dnd-la.onrender.com'
];

const app = express();

console.log('process.env.DATABASE as string: ', process.env.DATABASE as string)
app.use(cors({ origin: PROD_CLIENTS }))

// Connect DB
connectDB();

// Middlewares
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API up and running...');
});

//routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
 console.log(`Server is running on ${port}`)
});