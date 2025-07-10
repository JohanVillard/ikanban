import pool from '../../../config/connectDB.js';
import { User, UserDbRecord } from '../../../types/user.js';

class UserDb {
    /**
     * Crée un nouvel utilisateur dans la base de données.
     *
     * @param {User} user - L'utilisateur à créer, contenant son id, nom, email et mot de passe haché.
     * @returns {Promise<UserDbRecord | null>} - L'utilisateur créé, ou null si la création a échoué.
     * @throws {Error} - En cas d'erreur lors de l'insertion dans la base de données.
     */
    async create(user: User): Promise<UserDbRecord | null> {
        try {
            // 1. Déstructuration de l'objet user
            const { id, name, email, passwordHash } = user;

            // 2. Construction de la requête préparée
            const query =
                'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [id, name, email, passwordHash];

            // 3. Insertion du nouvel utilisateur
            const res = await pool.query(query, values);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error(
                'Erreur lors de la création utilisateur (db): ',
                error
            );
            throw new Error("Impossible de créer l'utilisateur.");
        }
    }

    async findByMail(email: string): Promise<UserDbRecord | null> {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const value = [email];

            const res = await pool.query(query, value);

            if (res.rows.length === 0) {
                return null;
            }

            const user = res.rows[0];
            return user;
        } catch (error) {
            console.error("Erreur lors de l'utilisateur (db): ", error);
            throw new Error("Impossible de récupérer l'utilisateur.");
        }
    }

    async findById(id: string): Promise<UserDbRecord | null> {
        try {
            const query = `SELECT * FROM users WHERE id = $1`;
            const value = [id];

            const res = await pool.query(query, value);
            if (res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error(
                "Erreur lors de la récupération de l'utilisateur (db): ",
                error
            );
            throw new Error("Impossible de récupérer l'utilisateur.");
        }
    }

    async findAll(): Promise<UserDbRecord[]> {
        try {
            const query = `SELECT * FROM users`;

            const res = await pool.query(query);

            return res.rows;
        } catch (error) {
            console.error(
                'Erreur lors de la récupération de la liste des utilisateurs (db): ',
                error
            );
            throw new Error(
                'Impossible de récupérer la liste des utilisateurs.'
            );
        }
    }

    async update(
        name: string,
        email: string,
        id: string
    ): Promise<UserDbRecord> {
        try {
            const query = `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`;
            const values = [name, email, id];

            const res = await pool.query(query, values);

            return res.rows[0];
        } catch (error) {
            console.error(
                "Erreur lors de la mise à jour de l'utilisateur (db): ",
                error
            );
            throw new Error("Impossible de mettre à jour l'utilisateur.");
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const query = 'DELETE FROM users WHERE id = $1';
            const values = [id];

            const res = await pool.query(query, values);

            // rowCount compte le nombre de lignes traitées lors de la requête
            return res.rowCount === 1;
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de l'utilisateur (db): ",
                error
            );
            throw new Error("Impossible de supprimer l'utilisateur.");
        }
    }
}

export default UserDb;
