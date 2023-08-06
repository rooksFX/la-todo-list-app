import { ITask, TAPIResponse, TTasksToReorder } from "../../context/types";

const PROD_API = 'https://tasks-api-la.onrender.com'
const URL = process.env.NODE_ENV === 'production' ? PROD_API : '';

const sessionToken = localStorage.getItem('session_token') || '';

export const getTasksAction = async (email: string, session: string) => {
    try {
        const response = await fetch(`${URL}/api/tasks/get?email=${email}`, {
            headers: { 'Authorization': `Bearer ${session || sessionToken}` }
        });
        const data = await response.json();

        console.log('getTasksAction | data: ', data);

        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Tasks fetched.',
                data: data.data,
            }
            return APIResponse;
        }
        else {
            const errorMessage = data.error;
            throw errorMessage;
        }
    } catch (error) {
        console.error('Get Tasks error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const upsertTaskAction = async (task: ITask, session: string) => {
    try {
        const upsertType = task.order ? 'update' : 'create';
        const response = await fetch(`${URL}/api/tasks/${upsertType}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session || sessionToken}`
            },
            method: upsertType === 'create' ? 'POST' : 'PUT',
            body: JSON.stringify(task)
        })
        const data = await response.json();

        if (response.ok) {
            const successMessage = upsertType === 'create' ? 'created' : 'updated';
            const APIResponse: TAPIResponse = {
                success: true,
                message: `Task ${successMessage}.`,
                data: data.data,
            }
            return APIResponse;
        }
        else {
            const errorMessage = data.error;
            throw errorMessage;
        }
    } catch (error) {
        console.error('Upsert Task error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const patchTaskAction = async (id: string, field: string, value: string, session: string) => {
    try {
        const tasks = [{
            _id: id,
            field, value
        }]
        const response = await fetch(`${URL}/api/tasks/patch`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session || sessionToken}`
            },
            method: 'PATCH',
            body: JSON.stringify(tasks)
        })
        const data = await response.json();

        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                
                message: 'Task updated.',
                data: data.data,
            }
            return APIResponse;
        }
        else {
            const errorMessage = data.error;
            throw errorMessage;
        }
    } catch (error) {
        console.error('Patch Task error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const reorderTasksAction = async (tasksToReorder: TTasksToReorder[], session: string) => {
    try {
        const response = await fetch(`${URL}/api/tasks/reorder`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session || sessionToken}`
            },
            method: 'PATCH',
            body: JSON.stringify(tasksToReorder)
        })
        const data = await response.json();

        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Tasks updated.',
                data: data.data,
            }
            return APIResponse;
        }
        else {
            const errorMessage = data.error;
            throw errorMessage;
        }
    } catch (error) {
        console.error('Reorder Tasks error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const deleteTaskAction = async (task: ITask, session: string) => {
    try {
        const response = await fetch(`${URL}/api/tasks/delete/${task._id}`, {
            headers: { 'Authorization': `Bearer ${session || sessionToken}` },
            method: 'DELETE'
        });
        const data = await response.json();

        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: `Task, "${task.task}",  deleted.`,
                data: data.data,
            }
            return APIResponse;
        }
        else {
            const errorMessage = data.error;
            throw errorMessage;
        }
    } catch (error) {
        console.error('Delete Task error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}