import { TActionTypes, IState, ActionTypes } from "./types";


export default ( state: IState, action: TActionTypes ): IState => {
    switch(action.type) {
        case ActionTypes.SIGNIN_SUCCESS_ACTION:
            return {
                ...state,
                sessionToken: action.payload.sessionToken,
                user: {
                    email: action.payload.email,
                    name: action.payload.name
                }
            }
        case ActionTypes.GET_USER_TASKS_SUCCESS_ACTION:
            return {
                ...state,
                userTasks: action.payload
            }
        default:
            return state
        
    }

}