import { ColumnDbRecord } from '../../../types/column';
import pool from '../../../config/connectDB';

class ColumnDb {
    async create(
        id: string,
        boardId: string,
        name: string
    ): Promise<ColumnDbRecord> {
        try {
            const query =
                'INSERT INTO columns (id, board_id, name) VALUES ($1, $2, $3) RETURNING *';
            const values = [id, boardId, name];

            const res = await pool.query(query, values);

            return res.rows[0];
        } catch (error: any) {
            console.error(
                `Erreur lors de la création de la colonne (db): ${error.message}`
            );
            throw new Error('Impossible de créer une colonne.');
        }
    }

    async findById(id: string): Promise<ColumnDbRecord | null> {
        try {
            const query = 'SELECT * FROM columns WHERE id = $1';
            const value = [id];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error: any) {
            console.error(
                `Erreur lors de la récupération de la colonne (db): ${error}`
            );
            throw new Error('Impossible de récupérer le tableau.');
        }
    }

    async findAll(): Promise<ColumnDbRecord[] | null> {
        try {
            const query = 'SELECT * FROM columns';

            const res = await pool.query(query);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows;
        } catch (error: any) {
            console.error(
                `Erreur lors de la récupération de la liste de toutes les colonnes (db) : ${error}`
            );
            throw new Error('Impossible de récupérer la liste des colonnes.');
        }
    }

    async findByBoardId(boardId: string): Promise<ColumnDbRecord[] | null> {
        try {
            const query = 'SELECT * FROM columns WHERE board_id = $1';
            const value = [boardId];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows;
        } catch (error: any) {
            console.error(
                `Erreur lors de la récupération de la liste de toutes les colonnes par tableau (db) : ${error}`
            );
            throw new Error(
                'Impossible de récupérer la liste des colonnes par tableau.'
            );
        }
    }

    async findByNameAndByBoardId(
        name: string,
        boardId: string
    ): Promise<ColumnDbRecord | null> {
        try {
            const query =
                'SELECT * FROM columns WHERE name = $1 AND board_id = $2';
            const value = [name, boardId];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error: any) {
            console.error(
                `Erreur lors de la récupération de la colonne ${name} du tableau ${boardId} (db): ${error}`
            );
            throw new Error(
                `Impossible de récupérer la colonne ${name} du tableau.`
            );
        }
    }

    async update(name: string, id: string): Promise<ColumnDbRecord> {
        try {
            const query =
                'UPDATE columns set name = $1 WHERE id = $2 RETURNING *';
            const values = [name, id];

            const res = await pool.query(query, values);

            return res.rows[0];
        } catch (error: any) {
            console.error(
                `Erreur lors de la mise à jour de la colonne (db) : ${error}`
            );
            throw new Error('Impossible de récupérer la colonne.');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const query = 'DELETE FROM columns WHERE id = $1';
            const value = [id];

            const res = await pool.query(query, value);

            return res.rowCount === 1;
        } catch (error: any) {
            console.error(
                `Erreur lors de la suppression de la colonne (db) : ${error}`
            );
            throw new Error('Impossible de supprimer la colonne.');
        }
    }
}

export default ColumnDb;
