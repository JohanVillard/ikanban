import BASE_API_URL from '../config/api';
import {
    ApiFailure,
    ApiSuccess,
    AuthUserResponse,
    DeleteUserResponse,
    UpdateUserResponse,
    UserProfileResponse,
    ValidationError,
} from '../types/api.ts';
import { User } from '../types/user.ts';

export async function authUser(credentials: string): Promise<AuthUserResponse> {
    const response = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: credentials,

        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 422 && data.errors) {
            return data as ValidationError;
        } else {
            return data as ApiFailure;
        }
    }

    return data as ApiSuccess<string>;
}

export async function logoutUser(): Promise<void> {
    try {
        const response = await fetch(`${BASE_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        });
        console.log(response);

        if (!response.ok) {
            const data = await response.json();

            console.error('Erreur lors de la déconnexion: ', data);
            return;
        }
    } catch (error) {
        console.error('Erreur inconnue lors de la déconnexion: ', error);
    }
}

export async function isAuthenticated(): Promise<boolean> {
    try {
        const response = await fetch(`${BASE_API_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        });

        return response.ok;
    } catch (error) {
        console.error(
            "Erreur inconnue lors de la vérification de l'utilisateur: ",
            error
        );
        return false;
    }
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
    try {
        const response = await fetch(`${BASE_API_URL}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<User>;
    } catch (error) {
        console.error(
            "Erreur inconnue lors de la vérification de l'utilisateur: ",
            error
        );

        throw error;
    }
}

export async function deleteUser(): Promise<DeleteUserResponse> {
    try {
        const response = await fetch(`${BASE_API_URL}/user`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<string>;
    } catch (error) {
        console.error(
            "Erreur inconnue lors de la suppression de l'utilisateur: ",
            error
        );

        throw error;
    }
}

export async function updateUser(
    credentials: string
): Promise<UpdateUserResponse> {
    try {
        const response = await fetch(`${BASE_API_URL}/user`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
            body: credentials,
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<User>;
    } catch (error) {
        console.error(
            "Erreur inconnue lors de la mise à jour de l'utilisateur: ",
            error
        );

        throw error;
    }
}
