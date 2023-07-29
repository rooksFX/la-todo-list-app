import { Dispatch, createContext, useReducer } from 'react';
import { ActionTypes, IState, IUserSignin, TActionTypes } from './types';
import Reducer from './Reducer';

const DEV_API = 'http://localhost:8000';

const initialState: IState = {
    sessionToken: 'test',
    user: {
        name: '',
        email: '',
    },
    userTasks: null,
}

export const AppContext = createContext<IState>(initialState);

export const AppProvider = ({ children } : { children: JSX.Element }) => {
    const [state, dispatch]: [IState, Dispatch<TActionTypes>] = useReducer(Reducer, initialState);

    console.log('AppProvider | state: ', state);

    const signinAction = async (payload: IUserSignin) => {
        console.log('signinAction | payload: ', payload);
        console.log('signinAction | JSON.stringify(payload): ', JSON.stringify(payload));
        try {
            const response = await fetch(`/api/signin`, {
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
                }, sessionToken } = data;
    
                console.log('data: ', data);
    
                localStorage.setItem('session_token', sessionToken)

                dispatch({
                    type: ActionTypes.SIGNIN_SUCCESS_ACTION,
                    payload: {
                        email,
                        name,
                        sessionToken,
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

    return (
        <AppContext.Provider
            value={{
                signinAction: signinAction,
                sessionToken: state.sessionToken,
                user: state.user,
                userTasks: state.userTasks
            }}
        >
            {children}
        </AppContext.Provider>
    )
}