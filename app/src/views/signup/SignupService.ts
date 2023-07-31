import { IUserSignup, TAPIResponse } from "../../context/types";


export const signupPost = async (body: IUserSignup) => {
    try {
        const response = await fetch('/api/auth/signup', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            }
        )

        const data = await response.json();
        console.log('data: ', data);
        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Account created.'
            }
            return APIResponse;
        }
        else {
            const errorMessage = Object.values(data.errors[0])[0];
            throw errorMessage;
        };
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}