import { Dispatch } from "react";

export interface IState {
    sessionToken: string;
    user: IUser;
    userTasks: IUserTasks | null;
    signinAction?: Dispatch<IUserSignin>;
}

export interface IUser {
    name: string;
    email: string;
}

export interface IUserTasks {
    email: string;
    tasks: ITask[];
}

export interface ITask {
    id: string;
    task: string;
    title: string;
    status: string;
}

export interface IUserSignup {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface IUserSignin {
    email: string;
    password: string;
}

export interface IUserSigninSuccessPayload {
    email: string;
    name: string;
    sessionToken: string;
}

export interface IGetUserTasksSuccessPayload {
    name: string;
}

export type TAPIResponse = {
    success: boolean;
    message: string;
}

export enum ActionTypes {
    SIGNUP_ACTION = 'SIGNUP_ACTION',
    SIGNUP_SUCCESS_ACTION = 'SIGNUP_SUCCESS_ACTION',
    SIGNUP_ERROR_ACTION = 'SIGNUP_ERROR_ACTION',

    SIGNIN_ACTION = 'SIGNIN_ACTION',
    SIGNIN_SUCCESS_ACTION = 'SIGNIN_SUCCESS_ACTION',
    SIGNIN_ERROR_ACTION = 'SIGNIN_ERROR_ACTION',
    
    GET_USER_TASKS_ACTION = 'GET_USER_TASKS_ACTION',
    GET_USER_TASKS_SUCCESS_ACTION = 'GET_USER_TASKS_SUCCESS_ACTION',
    GET_USER_TASKS_ERROR_ACTION = 'GET_USER_TASKS_ERROR_ACTION',



    SET_ERROR = 'SET_ERROR',
    SET_RESULTS = 'SET_RESULTS',
}

export type TActionTypes = 
    { type: ActionTypes.SIGNUP_ACTION, payload: IUserSignup }
    | { type: ActionTypes.SIGNIN_SUCCESS_ACTION, payload: IUserSigninSuccessPayload }
    | { type: ActionTypes.SIGNIN_ACTION, payload: IUserSignin }
    | { type: ActionTypes.GET_USER_TASKS_SUCCESS_ACTION, payload: IUserTasks }
    | { type: ActionTypes.GET_USER_TASKS_ACTION }