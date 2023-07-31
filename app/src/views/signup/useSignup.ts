import useSWR from "swr";
import { IUserSignup, TAPIResponse } from "../../context/types"

const signupPost = async (body: IUserSignup) => {
    try {
        const response = await fetch('/api/signup', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            }
        )
        if (response.ok) {
            const APIResponse: TAPIResponse = {
                success: true,
                message: 'Account created.'
            }
            return APIResponse;
        }
        else {
            throw 'Something went wrong...';
        };
    } catch (error) {
        const APIResponse: TAPIResponse = {
            success: false,
            message: error as unknown as string
        };
        return APIResponse;
    }
}

const useSignup = () => {
    const { data, error } = useSWR('/signup', signupPost);

    return {
        data,
        error,
        isLoading: !error && !data
    };
};

export default useSignup;