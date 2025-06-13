import BASE_API_URL from '../config/api';
import { Column } from '../types/column';
import {
    ApiFailure,
    ApiSuccess,
    ColumnResponse,
    ColumnsInBoardResponse,
    ValidationError,
} from '../types/api';

export async function createColumn(
    boardId: string,
    name: string,
    wip: string
): Promise<ColumnResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, wip }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                return data as ValidationError;
            } else {
                return data as ApiFailure;
            }
        }

        return data as ApiSuccess<Column>;
    } catch (error) {
        console.error('Erreur lors de la récupération des colonnes: ', error);
        throw error;
    }
}

export async function getColumnsByBoardId(
    boardId: string
): Promise<ColumnsInBoardResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
            }
        );
        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<Column[]>;
    } catch (error) {
        console.error('Erreur lors de la récupération des colonnes: ', error);
        throw error;
    }
}

export async function fetchColumnByIdAndBoard(
    columnId: string,
    boardId: string
): Promise<Column> {
    const response = await fetch(
        `${BASE_API_URL}/board/${boardId}/column/${columnId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        }
    );

    const column: Column = await response.json();
    return column;
}

export async function updateColumn(
    boardId: string,
    colId: string,
    name: string,
    wip: string
): Promise<ColumnResponse> {
    const response = await fetch(
        `${BASE_API_URL}/board/${boardId}/column/${colId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, wip }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) {
            return data as ValidationError;
        } else {
            return data as ApiFailure;
        }
    }

    return data as ApiSuccess<Column>;
}

export async function deleteColumn(
    boardId: string,
    columnId: string
): Promise<void> {
    const response = await fetch(
        `${BASE_API_URL}/board/${boardId}/column/${columnId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        }
    );

    await response.json();
}
