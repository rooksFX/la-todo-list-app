import { Dispatch, createContext, useReducer } from 'react';
import { ActionTypes, IState, ITask, IUserSignin, TActionTypes } from './types';
import Reducer from './Reducer';

const DEV_API = 'http://localhost:8000';

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

    console.log('AppProvider | state: ', state);

    const signinAction = async (payload: IUserSignin) => {
        console.log('signinAction | payload: ', payload);
        console.log('signinAction | JSON.stringify(payload): ', JSON.stringify(payload));
        try {
            const response = await fetch(`/api/auth/signin`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(payload)
            });
            console.log('response: ', response);

            if (response.ok) {
                const data = await response.json();
    
                const { message: {
                    email, name
                }, token } = data;
    
                console.log('data: ', data);
    
                localStorage.setItem('session_token', token);
                localStorage.setItem('email', email);

                dispatch({
                    type: ActionTypes.SIGNIN_SUCCESS_ACTION,
                    payload: {
                        email,
                        name,
                        sessionToken: token,
                    }
                })
            }
            else {
                throw response.statusText;
            }
        } catch (error) {
            console.error('Signin error: ', error);
            return error;
        }
    };

    const updateTasksAction = (payload: ITask[]) => {
        dispatch({
            type: ActionTypes.GET_USER_TASKS_SUCCESS_ACTION,
            payload
        })
    }


    const logoutAction = () => {
        localStorage.removeItem('session_token');
        localStorage.removeItem('email');
        dispatch({
            type: ActionTypes.LOGOUT_ACTION
        });
    }

    return (
        <AppContext.Provider
            value={{
                signinAction: signinAction,
                updateTasksAction: updateTasksAction,
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