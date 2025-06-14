import { ColumnDbRecord } from '../../../types/column.js';
import pool from '../../../config/connectDB.js';

class ColumnDb {
    async create(
        id: string,
        boardId: string,
        name: string,
        wip: number | null
    ): Promise<ColumnDbRecord> {
        try {
            // Récupérer la plus grande position actuelle dans le tableau
            // Si aucune colonne n'est créée, alors la position de la première colonne sera 0
            const positionResult = await pool.query(
                'SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM columns WHERE board_id = $1',
                [boardId]
            );

            const position = positionResult.rows[0].next_position;
            const query =
                'INSERT INTO columns (id, board_id, name, position, wip) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [id, boardId, name, position, wip];

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
            // Trier par ordre croisssant la position des colonnes
            const query =
                'SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC';
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

    async update(
        name: string,
        wip: number | null,
        id: string
    ): Promise<ColumnDbRecord> {
        try {
            const query =
                'UPDATE columns SET name = $1, wip = $2 WHERE id = $3 RETURNING *';
            const values = [name, wip, id];

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
