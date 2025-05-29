import BASE_API_URL from '../config/api';
import {
    ApiFailure,
    ApiSuccess,
    BoardResponse,
    ValidationError,
} from '../types/api';
import { Board } from '../types/board';

export async function createBoard(name: string): Promise<BoardResponse> {
    const response = await fetch(`${BASE_API_URL}/board`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) {
            return data as ValidationError;
        } else {
            return data as ApiFailure;
        }
    }

    return data as ApiSuccess<Board>;
}

export async function fetchBoards(): Promise<Board[]> {
    const response = await fetch(`${BASE_API_URL}/boards`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
    });

    const boards: Board[] = await response.json();
    return boards;
}

export async function fetchBoardById(id: string): Promise<Board> {
    const response = await fetch(`${BASE_API_URL}/board/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
    });

    const board: Board = await response.json();
    return board;
}

export async function updateBoard(
    id: string,
    name: string
): Promise<BoardResponse> {
    const response = await fetch(`${BASE_API_URL}/board/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) {
            return data as ValidationError;
        } else {
            return data as ApiFailure;
        }
    }

    return data as ApiSuccess<Board>;
}

export async function deleteBoard(id: string): Promise<void> {
    const response = await fetch(`${BASE_API_URL}/board/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include',
    });

    await response.json();
}
