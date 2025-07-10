/**
 * Représente une colonne tel qu'elle est stockée en base de données
 */
export type ColumnDbRecord = {
    id: string;
    board_id: string;
    name: string;
    position: number;
    wip: number | null;
};

/**
 * Représente une tâche dans l'API
 */
export type Column = {
    id: string;
    boardId: string;
    name: string;
    position: number;
    wip: number | null;
};

/**
 * Réprésente les données nécéssaires pour valider les entrées d'une colonne
 */
export type ColumnValidationInput = {
    name: string;
    wip: number | null;
    boardId: string;
    isNewName?: boolean;
};
