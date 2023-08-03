import { TActionTypes, IState, ActionTypes } from "./types";


export default ( state: IState, action: TActionTypes ): IState => {
    switch(action.type) {
        case ActionTypes.GET_USER_TASKS_SUCCESS_ACTION:
            return {
                ...state,
                tasks: action.payload
            }
        case ActionTypes.LOGIN_SUCCESS_ACTION:
            return {
                ...state,
                user: {
                    email: action.payload.email,
                    name: action.payload.name,
                    session: action.payload.session,
                }
            }
        case ActionTypes.LOGOUT_ACTION:
            return {
                ...state,
                sessionToken: '',
                user: {
                    name: '',
                    email: '',
                    session: '',
                },
            }
        default:
            return state
        
    }

}