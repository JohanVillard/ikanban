import { Task, TaskDbRecord } from '../../../types/task.js';
import pool from '../../../config/connectDB.js';

/**
 * Classe pour interagir avec la base de données des tâches.
 * Cette classe contient des méthodes pour créer, récupérer, mettre à jour et supprimer des tâches dans la base de données en effectuant des requêtes SQL.
 */
class TaskDb {
    /**
     * Crée une nouvelle tâche dans la base de données, associée à une colonne spécifique.
     * La position de la tâche est automatiquement déterminée comme la suivante dans l'ordre.
     *
     * @param {string} id - L'identifiant unique de la tâche (UUID).
     * @param {string} columnId - L'identifiant de la colonne à laquelle la tâche appartient (UUID).
     * @param {string} name - Le nom de la tâche.
     * @param {string} description - La description de la tâche. Peut être une chaîne vide ou null.
     * @returns {Promise<TaskDbRecord>} Un objet représentant la tâche nouvellement créée.
     * @throws {Error} En cas d'erreur lors de l'insertion dans la base de données.
     */

    async create(
        id: string,
        columnId: string,
        name: string,
        description: string
    ): Promise<TaskDbRecord> {
        try {
            const positionResult = await pool.query(
                'SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM tasks WHERE column_id = $1',
                [columnId]
            );

            const position = positionResult.rows[0].next_position;
            const query =
                'INSERT INTO tasks (id, column_id, name, description, position) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [id, columnId, name, description, position];

            const res = await pool.query(query, values);

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur de lors de la création de la tâche (db): ${error}`
            );
            throw new Error('Impossible de créer la tâche.');
        }
    }

    /**
     * Récupère une tâche par son ID.
     * Retourne `null` si la tâche n'existe pas.
     *
     * @param {string} id - L'ID de la tâche à récupérer.
     * @returns {Promise<TaskDb | null>} La tâche récupérée ou `null` si non trouvée.
     * @throws {Error} Si une erreur survient lors de la récupération de la tâche.
     */
    async findById(id: string): Promise<TaskDbRecord | null> {
        try {
            const query = 'SELECT * FROM tasks WHERE id = $1';
            const value = [id];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur de lors de la récupération de la tâche (db): ${error}`
            );
            throw new Error('Impossible de récupérer la tâche.');
        }
    }

    /**
     * Récupère toutes les tâches.
     * Retourne `null` si aucune tâche n'est trouvée.
     *
     * @returns {Promise<TaskDb[] | null>} La liste de toutes les tâches ou `null` si aucune tâche n'est trouvée.
     * @throws {Error} Si une erreur survient lors de la récupération des tâches.
     */
    async findAll(): Promise<TaskDbRecord[] | null> {
        try {
            const query = 'SELECT * FROM tasks';

            const res = await pool.query(query);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows;
        } catch (error) {
            console.error(
                `Erreur de lors de la récupération de la liste de toutes les tâches (db): ${error}`
            );
            throw new Error(
                'Impossible de récupérer la liste de toutes les tâches.'
            );
        }
    }

    /**
     * Récupère toutes les tâches d'une colonne spécifique.
     * Retourne `null` si aucune tâche n'est trouvée dans cette colonne.
     *
     * @param {string} columnId - L'ID de la colonne pour laquelle récupérer les tâches.
     * @returns {Promise<TaskDb[] | null>} La liste des tâches de la colonne ou `null` si aucune tâche n'est trouvée.
     * @throws {Error} Si une erreur survient lors de la récupération des tâches.
     */
    async findByColumnId(columnId: string): Promise<TaskDbRecord[] | null> {
        try {
            const query = 'SELECT * FROM tasks WHERE column_id = $1';
            const value = [columnId];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows;
        } catch (error) {
            console.error(
                `Erreur de lors de la récupération de la liste de toutes les tâches de la colonne (db): ${error}`
            );
            throw new Error(
                'Impossible de récupérer la liste de toutes les tâches de la colonne.'
            );
        }
    }

    /**
     * Vérifie si une tâche avec un nom donné existe déjà dans une colonne et un tableau spécifiques.
     * Retourne la tâche si elle existe, ou `null` si elle n'existe pas.
     *
     * @param {string} name - Le nom de la tâche à vérifier.
     * @param {string} columnId - L'ID de la colonne où la tâche pourrait exister.
     * @returns {Promise<TaskDb | null>} La tâche trouvée ou `null` si elle n'existe pas.
     * @throws {Error} Si une erreur survient lors de la récupération de la tâche.
     */
    async findByNameAndBoardId(
        name: string,
        columnId: string
    ): Promise<TaskDbRecord | null> {
        try {
            const columnQuery = 'SELECT * FROM columns WHERE id = $1';
            const columnValue = [columnId];

            const columnRes = await pool.query(columnQuery, columnValue);
            if (columnRes.rows.length === 0) {
                return null;
            }

            const boardId = columnRes.rows[0].board_id;

            // Il faut s'assurer que le nom de la tâche nexiste pas déjà dans tout le tableau
            const query =
                'SELECT tasks.* FROM tasks JOIN columns ON tasks.column_id = columns.id WHERE tasks.name = $1 AND columns.board_id = $2';
            const values = [name, boardId];

            const res = await pool.query(query, values);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur de lors de la récupération la tâche ${name} de la colonne ${columnId} du tableau (db): ${error}`
            );
            throw new Error(
                `Impossible de récupérer la tâche ${name} de la colonne.`
            );
        }
    }

    /**
     * Modifie une tâche existante.
     * Retourne la tâche mise à jour.
     *
     * @param {string} id - L'ID de la tâche à modifier.
     * @param {Partial<Task>} taskData - Les nouvelles données de la tâche à mettre à jour.
     * @returns {Promise<Task>} La tâche modifiée.
     * @throws {Error} Si la tâche n'existe pas ou si la modification échoue.
     */
    async update(id: string, taskData: Partial<Task>): Promise<TaskDbRecord> {
        try {
            const query =
                'UPDATE tasks SET name = $1, description = $2, column_id= $3, position=$4, done=$5 WHERE id = $6 RETURNING *';
            const values = [
                taskData.name,
                taskData.description,
                taskData.columnId,
                taskData.position,
                taskData.done,
                id,
            ];
            const res = await pool.query(query, values);

            return res.rows[0];
        } catch (error: any) {
            console.error(
                `Erreur de lors de la mise à jour de la tâche (db): ${error}`
            );
            throw new Error('Impossible de mettre à jour la tâche.');
        }
    }

    /**
     * Supprime une tâche par son ID.
     * Retourne `true` si la suppression est réussie, `false` sinon.
     *
     * @param {string} id - L'ID de la tâche à supprimer.
     * @returns {Promise<boolean>} Un booléen indiquant si la tâche a été supprimée avec succès.
     * @throws {Error} Si la suppression échoue.
     */
    async delete(id: string): Promise<boolean> {
        try {
            const query = 'DELETE FROM tasks WHERE id = $1';
            const value = [id];

            const res = await pool.query(query, value);

            return res.rowCount === 1;
        } catch (error) {
            console.error(
                `Erreur de lors de la mise à jour de la tâche (db): ${error}`
            );
            throw new Error('Impossible de mettre à jour la tâche.');
        }
    }
}

export default TaskDb;
