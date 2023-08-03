import { Dispatch } from "react";

export interface IState {
    sessionToken: string;
    user: IUser;
    tasks: ITask[] | null;
    signinAction?: (payload: IUserLogin) => TAPIResponse;
    updateTasksAction?: (payload: ITask[]) => void;
    loginSuccessAction?: (payload: IUser) => void;
    logoutAction?: () => void;
}

export interface IUser {
    name: string;
    email: string;
    session: string;
}

export interface ITask {
    _id?: string;
    task: string;
    email: string;
    order?: number;
    status: string;
}

export interface IUserRegister {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

export type TAPIResponse = {
    success: boolean;
    data?: ITask[] | IUser;
    message: string;
}

export enum ActionTypes {
    GET_USER_TASKS_SUCCESS_ACTION = 'GET_USER_TASKS_SUCCESS_ACTION',
    LOGIN_SUCCESS_ACTION = 'LOGIN_SUCCESS_ACTION',
    LOGOUT_ACTION = 'LOGOUT_ACTION',
}

export type TActionTypes = 
    | { type: ActionTypes.LOGIN_SUCCESS_ACTION, payload: IUser }
    | { type: ActionTypes.GET_USER_TASKS_SUCCESS_ACTION, payload: ITask[] }
    | { type: ActionTypes.LOGOUT_ACTION }