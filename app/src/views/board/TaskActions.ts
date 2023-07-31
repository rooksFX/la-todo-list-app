import { ITask, TAPIResponse } from "../../context/types";

export const getTasksAction = async (email: string) => {
    try {
        const response = await fetch(`/api/tasks/get?email=${email}`);
        const data = await response.json();
        console.log('getTasks | data: ', data.data );
        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Tasks fetched.',
                data: data.data,
            }
            return APIResponse;
        }
        else {
            const errorMessage = Object.values(data.errors[0])[0];
            throw errorMessage;
        }
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const upsertTaskAction = async (task: ITask) => {
    try {
        const upsertType = task.order ? 'update' : 'create';
        const response = await fetch(`/api/tasks/${upsertType}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
            const errorMessage = Object.values(data.errors[0])[0];
            throw errorMessage;
        }
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const patchTaskAction = async (id: string, field: string, value: string) => {
    try {
        const task = {
            _id: id,
            [field]: value
        }
        const response = await fetch('/api/tasks/patch', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(task)
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
            const errorMessage = Object.values(data.errors[0])[0];
            throw errorMessage;
        }
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

export const deleteTaskAction = async (task: ITask) => {
    try {
        const response = await fetch(`/api/tasks/delete/${task._id}`, {
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
            const errorMessage = Object.values(data.errors[0])[0];
            throw errorMessage;
        }
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}