/**
 * Représente une tâche tel qu'elle est stockée en base de données
 */
export type TaskDbRecord = {
    id: string;
    column_id: string;
    name: string;
    description: string;
    done: boolean;
    position: number;
};

/**
 * Représente une tâche dans l'API
 */
export type Task = {
    id: string;
    columnId: string;
    name: string;
    description: string;
    done: boolean;
    position: number;
};
