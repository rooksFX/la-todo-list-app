import { Request, Response } from "express"
import { TaskModel } from '../models/Task';

export const getTasks = async ( req: Request, res: Response ) => {
    let { email } = req.query;

    try {
        const tasks = await TaskModel.find({ email: email, })

        if (!tasks.length) {
            return res.status(404).json({ error: "No task yet created." });
        }
        else {
            return res.status(200).json({
                data: tasks       
            });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createTask = async ( req: Request, res: Response ) => {
    let { email, task, status } = req.body;

    try {
        const tasks = await TaskModel.find({ email: email, });
        
        const order = tasks.length? tasks.length + 1 : 1;

        const newTask = new TaskModel({ 
            task: task,
            email: email,
            order: order,
            status: status,
        });
        const response = newTask.save();
        res.status(200).json({
            success: true,
            result: response
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateTask = async ( req: Request, res: Response ) => {
    let { _id: id } = req.body;
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!updatedTask) {
            return res.status(400).json({
                success: false,
                error: 'No matching task found'
            });
        }
        else {
            return res.status(200).json({
                success: true,
                data: updatedTask
            });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const patchTask = async ( req: Request, res: Response ) => {
    let { _id: id } = req.body;
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!updatedTask) {
            return res.status(400).json({
                success: false,
                error: 'No matching task found'
            });
        }
        else {
            return res.status(200).json({
                success: true,
                data: updatedTask
            });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteTask = async ( req: Request, res: Response ) => {
    const { id } = req.params;
    try {
        const task = await TaskModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(400).json({
                success: false,
                error: 'No matching task found'
            });
        }
        else {
            await task.deleteOne();
            return res.status(200).json({
                success: true,
                data: task
            });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};