import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv  from 'dotenv';

import { connectDB } from './db';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

console.log('process.env.DATABASE as string: ', process.env.DATABASE as string)

// Connect DB
connectDB();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API up and running...');
});

//routes middleware
app.use('/api', authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
 console.log(`Welcome to the mern auth tutorial! Server is running on ${port}`)
});