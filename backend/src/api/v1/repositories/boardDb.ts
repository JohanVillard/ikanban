import pool from '../../../config/connectDB';
import { BoardDbRecord } from '../../../types/board';

class BoardDb {
    async create(
        id: string,
        name: string,
        userId: string
    ): Promise<BoardDbRecord> {
        try {
            const query =
                'INSERT INTO boards (id, name, user_id) VALUES ($1, $2, $3) RETURNING *';
            const values = [id, name, userId];

            const res = await pool.query(query, values);

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur lors de la création du tableau (db): ${error}`
            );
            throw new Error('Impossible de créer un tableau.');
        }
    }

    async findById(id: string): Promise<BoardDbRecord | null> {
        try {
            const query = 'SELECT * FROM boards WHERE id = $1';
            const value = [id];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur lors de la récupération du tableau (db): ${error}`
            );
            throw new Error('Impossible de récupérer le tableau.');
        }
    }

    async findAll(): Promise<BoardDbRecord[] | null> {
        try {
            const query = 'SELECT * from boards';

            const res = await pool.query(query);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la liste de tous les tableaux (db): ${error}`
            );
            throw new Error(
                'Impossible de récupérer la liste de tous les tableaux.'
            );
        }
    }

    async findByUserId(userId: string): Promise<BoardDbRecord[] | null> {
        try {
            const query = 'SELECT * from boards WHERE user_id = $1';
            const value = [userId];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la liste des tableaux de l'utilisateur (db): ${error}`
            );
            throw new Error(
                "Impossible de récupérer la liste des tableaux de l'utilisateur."
            );
        }
    }

    async findByNameAndByUserId(
        name: string,
        userId: string
    ): Promise<BoardDbRecord | null> {
        try {
            const query =
                'SELECT * FROM boards WHERE name = $1 AND user_id =$2';
            const value = [name, userId];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur lors de la récupération du tableau ${name} de l'utilisateur ${userId} (db): ${error}`
            );
            throw new Error(
                `Impossible de récupérer le tableau ${name} de l'utilisateur.`
            );
        }
    }

    async update(name: string, id: string): Promise<BoardDbRecord> {
        try {
            const query =
                'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *';
            const value = [name, id];

            const res = await pool.query(query, value);

            return res.rows[0];
        } catch (error) {
            console.error(
                `Erreur lors de la mise à jour du tableau (db): ${error}`
            );
            throw new Error('Impossible de mettre à jour le tableau.');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const query = 'DELETE FROM boards WHERE id = $1';
            const value = [id];

            const res = await pool.query(query, value);

            return res.rowCount === 1;
        } catch (error) {
            console.error(
                `Erreur lors de la suppression du tableau (db): ${error}`
            );
            throw new Error('Impossible de supprimer le tableau.');
        }
    }
}

export default BoardDb;
