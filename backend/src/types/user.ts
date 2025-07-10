/**
 * Représente un utilisateur tel qu'il est stocké en base de données
 */
export type UserDbRecord = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
};

/**
 * Représente un utilisateur dans l'API
 */
export type User = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
};

/**
 * Représente les données reçues à la création d'un utilisateur
 */
export type NewUser = {
    name: string;
    email: string;
    password: string;
    passconf: string;
};
