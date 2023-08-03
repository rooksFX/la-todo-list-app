import { Dispatch, createContext, useReducer } from 'react';
import { ActionTypes, IState, ITask, IUser, IUserLogin, TActionTypes } from './types';
import Reducer from './Reducer';

const initialState: IState = {
    sessionToken: '',
    user: {
        name: '',
        email: '',
        session: '',
    },
    tasks: []
}

export const AppContext = createContext<IState>(initialState);

export const AppProvider = ({ children } : { children: JSX.Element }) => {
    const [state, dispatch]: [IState, Dispatch<TActionTypes>] = useReducer(Reducer, initialState);

    const updateTasksAction = (payload: ITask[]) => {
        dispatch({
            type: ActionTypes.GET_USER_TASKS_SUCCESS_ACTION,
            payload
        })
    };

    const loginSuccessAction = (payload: IUser) => {
        localStorage.setItem('session_token', payload.session);
        localStorage.setItem('email', payload.email);
        localStorage.setItem('name', payload.name);
        dispatch({
            type: ActionTypes.LOGIN_SUCCESS_ACTION,
            payload
        });
    };


    const logoutAction = () => {
        localStorage.removeItem('session_token');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        dispatch({
            type: ActionTypes.LOGOUT_ACTION
        });
    };

    return (
        <AppContext.Provider
            value={{
                updateTasksAction: updateTasksAction,
                loginSuccessAction: loginSuccessAction,
                logoutAction: logoutAction,
                sessionToken: state.sessionToken,
                user: state.user,
                tasks: state.tasks
            }}
        >
            {children}
        </AppContext.Provider>
    )
}