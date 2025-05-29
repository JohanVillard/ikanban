import BASE_API_URL from '../config/api';
import {
    ApiFailure,
    ApiSuccess,
    RegisterUserResponse,
    ValidationError,
} from '../types/api.ts';
import { User } from '../types/user';

async function registerUser(
    credentials: string
): Promise<RegisterUserResponse> {
    const response = await fetch(`${BASE_API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: credentials,
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 422 && data.errors) {
            return data as ValidationError;
        } else {
            return data as ApiFailure;
        }
    }

    return data as ApiSuccess<User>;
}

export default registerUser;
