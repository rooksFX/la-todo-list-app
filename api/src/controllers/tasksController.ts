import { Request, Response } from "express"
import { TaskModel } from '../models/Task';

type TTaskPatch = {
    _id: string;
    field: string;
    value: string;
}

export const getTasks = async ( req: Request, res: Response ) => {
    let { email } = req.query;

    console.log('getTasks started... ');

    try {
        const tasks = await TaskModel.find({ email: email, })

        console.log('getTasks | tasks: ', tasks);

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

    console.log('createTask started... ');
    console.log('createTask | req.body: ', req.body);

    try {
        const tasks = await TaskModel.find({ email: email, });
        
        const order = tasks.length? tasks.length + 1 : 1;

        const newTask = new TaskModel({ 
            task: task,
            email: email,
            order: order,
            status: status,
        });
        newTask.save();

        console.log('createTask | newTask: ', newTask);

        res.status(200).json({
            success: true,
            result: newTask
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateTask = async ( req: Request, res: Response ) => {
    let { _id } = req.body;

    console.log('updateTask started... ');
    console.log('updateTask | req.body: ', req.body);

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(_id, req.body, {new: true});

        console.log('updateTask | updatedTask: ', updatedTask);

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
    let { _id } = req.body;

    console.log('patchTask started... ');
    console.log('patchTask | req.body: ', req.body);

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, {new: true});

        console.log('patchTask | updatedTask: ', updatedTask);

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

export const patchTasks = async ( req: Request, res: Response ) => {
    const tasksToReorder = req.body;

    console.log('reorderTasks started... ');
    console.log('reorderTasks | tasksToReorder: ', tasksToReorder);

    try {
        await tasksToReorder.forEach( async (task: TTaskPatch) => {
            const { _id, field, value  } = task;
            const updatedTask = await TaskModel.findByIdAndUpdate(_id, { [field]: value }, {new: true});
            console.log('Task reordered | updatedTask: ', updatedTask);
        });

        return res.status(200).json({
            success: true,
            data: { message: 'Tasks updated.' }
        });
    } catch (error) {
        
    }
};

export const deleteTask = async ( req: Request, res: Response ) => {
    const { id } = req.params;

    console.log('deleteTask started... ');
    console.log('deleteTask | req.body: ', req.body);

    try {
        const task = await TaskModel.findByIdAndDelete(id);

        console.log('deleteTask | task: ', task);

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