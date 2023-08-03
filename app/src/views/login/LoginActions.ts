import { IUser, IUserLogin, TAPIResponse } from "../../context/types";

export const loginAction = async (payload: IUserLogin) => {
    try {
        const response = await fetch(`/api/auth/login`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (response.ok) {
            const { user: { email, name }, token } = data;

            const userData: IUser = {
                    email, name, session: token,
            }
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Login successful.',
                data: userData
            }
            
            return APIResponse;
        }
        else {
            throw data.error;
        }
    } catch (error) {
        console.error('Login error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
};