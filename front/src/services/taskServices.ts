import BASE_API_URL from '../config/api';
import {
    ApiFailure,
    ApiSuccess,
    DeleteStatus,
    TaskInBoardResponse,
    TaskListInBoardResponse,
    TaskResponse,
    UpdateTaskResponse,
    ValidationError,
} from '../types/api';
import { Task } from '../types/task';

export async function createTask(
    boardId: string,
    columnId: string,
    taskData: Partial<Task>
): Promise<TaskResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(taskData),
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

        return data as ApiSuccess<Task>;
    } catch (error) {
        console.error(
            `La mise à jour de l'id de la colonne a échouée : ${error}`
        );
        throw error;
    }
}

export async function fetchTasksByColumns(
    boardId: string,
    columnId: string
): Promise<TaskListInBoardResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task`,
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

        return data as ApiSuccess<Task[]>;
    } catch (error) {
        console.error(`La récupération de la colonne a échouée: ${error}`);
        throw error;
    }
}

export async function fetchTaskInBoardColumn(
    taskId: string,
    columnId: string,
    boardId: string
): Promise<TaskInBoardResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task/${taskId}`,
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

        return data as ApiSuccess<Task>;
    } catch (error) {
        console.error(`La récupération de la tâche a échouée : ${error}`);
        throw error;
    }
}

export async function updateColumnIdTask(
    boardId: string,
    columnId: string,
    taskId: string,
    newColumnId: string
): Promise<UpdateTaskResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task/${taskId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ columnId: newColumnId }),
            }
        );
        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<Task>;
    } catch (error) {
        console.error(
            `La mise à jour de l'id de la colonne a échouée : ${error}`
        );
        throw error;
    }
}

export async function updateTaskPosition(
    boardId: string,
    columnId: string,
    taskId: string,
    newPosition: number
): Promise<UpdateTaskResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task/${taskId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    columnId: columnId,
                    position: newPosition,
                }),
            }
        );
        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<Task>;
    } catch (error) {
        console.error(
            `La mise à jour de la position de la tâche dans la colonne a échouée : ${error}`
        );
        throw error;
    }
}

export async function updateTaskStatus(
    boardId: string,
    columnId: string,
    taskId: string,
    newStatus: boolean
): Promise<UpdateTaskResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task/${taskId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ columnId: columnId, done: newStatus }),
            }
        );
        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<Partial<Task>>;
    } catch (error) {
        console.error(
            `La mise à jour du statut de la tâche dans la colonne a échouée : ${error}`
        );
        throw error;
    }
}

export async function updateTaskDetails(
    boardId: string,
    columnId: string,
    taskId: string,
    taskData: Partial<Task>
): Promise<UpdateTaskResponse> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/column/${columnId}/task/${taskId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(taskData),
            }
        );
        const data = await response.json();

        if (!response.ok) {
            return data as ApiFailure;
        }

        return data as ApiSuccess<Partial<Task>>;
    } catch (error) {
        console.error(`La mise à jour de l'id de la tâche a échoué : ${error}`);
        throw error;
    }
}

export async function deleteTask(
    boardId: string,
    taskId: string
): Promise<DeleteStatus> {
    try {
        const response = await fetch(
            `${BASE_API_URL}/board/${boardId}/task/${taskId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include',
            }
        );

        if (!response.ok) {
            const errorResponse = await response.json();
            return errorResponse;
        }

        return response.json();
    } catch (error) {
        console.error(`La suppression de la tâche a échouée : ${error}`);
        throw error;
    }
}
