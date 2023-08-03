import { IUserRegister, TAPIResponse } from "../../context/types";


export const registerAction = async (body: IUserRegister) => {
    try {
        const response = await fetch('/api/auth/register', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            }
        )

        const data = await response.json();
        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Account created.'
            }
            return APIResponse;
        }
        else {
            const errorMessage = data.error;
            throw errorMessage;
        };
    } catch (error) {
        console.error('Register error: ', error);
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}