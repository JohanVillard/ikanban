import { TaskDbRecord } from '../../../types/task';
import pool from '../../../config/connectDB';

/**
 * Classe pour interagir avec la base de données des tâches.
 * Cette classe contient des méthodes pour créer, récupérer, mettre à jour et supprimer des tâches dans la base de données en effectuant des requêtes SQL.
 */
class TaskDb {
    /**
     * Crée une nouvelle tâche dans la base de données.
     * Retourne la tâche créée.
     *
     * @param {string} id - L'ID de la tâche à créer.
     * @param {string} columnId - L'ID de la colonne à laquelle la tâche appartient.
     * @param {string} name - Le nom de la tâche.
     * @param {string} description - La description de la tâche.
     * @returns {Promise<TaskDb>} La tâche créée.
     * @throws {Error} Si une erreur survient lors de la création de la tâche.
     */
    async create(
        id: string,
        columnId: string,
        name: string,
        description: string
    ): Promise<TaskDbRecord> {
        try {
            const query =
                'INSERT INTO tasks (id, column_id, name, description) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [id, columnId, name, description];

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
    async findByNameAndColumnIdAndBoardId(
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
                'SELECT tasks.* FROM tasks JOIN columns ON tasks.column_id = columns.id WHERE tasks.name = $1 AND tasks.column_id = $2 AND columns.board_id = $3';
            const values = [name, columnId, boardId];

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
     * @param {string} name - Le nouveau nom de la tâche.
     * @param {string} description - La nouvelle description de la tâche.
     * @param {string} id - L'ID de la tâche à modifier.
     * @returns {Promise<Task>} La tâche modifiée.
     * @throws {Error} Si la tâche n'existe pas ou si la modification échoue.
     */
    async update(
        name: string,
        description: string,
        id: string
    ): Promise<TaskDbRecord> {
        try {
            const query =
                'UPDATE tasks SET name = $1, description = $2 WHERE id = $3 RETURNING *';
            const values = [name, description, id];

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
