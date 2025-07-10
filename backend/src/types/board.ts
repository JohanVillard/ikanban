/**
 * Représente un tableau tel qu'il est stocké en base de données
 */
export type BoardDbRecord = {
    id: string;
    user_id: string;
    name: string;
};

/**
 * Représente un tableau dans l'API
 */
export type Board = {
    id: string;
    userId: string;
    name: string;
};
