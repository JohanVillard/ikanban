import pool from "../config/connectDB";
import User from "../models/user";

class UserDb {
	async create(id: string, name: string, email: string, passwordHash: string): Promise<User> {
		try {
			const query = 'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
			const values = [id, name, email, passwordHash];

			const res = await pool.query(query, values);
			return res.rows[0];
		} catch (error) {
			console.error("Erreur lors de la création utilisateur (Repositories): ", error);
			throw new Error("Impossible de créer l'utilisateur.")
		}
	}

	async findByMail(email: string): Promise<User | null> {
		try {
			const query = 'SELECT * FROM users WHERE email = $1';
			const value = [email];

			const res = await pool.query(query, value);

			if (res.rows.length === 0) {
				return null;
			}
			const user = { ...res.rows[0], passwordHash: res.rows[0].password_hash };

			return user;
		} catch (error) {
			console.error("Erreur lors de l'utilisateur (Repositories): ", error);
			throw new Error("Impossible de récupérer l'utilisateur.")
		}
	}

	async findById(id: string): Promise<User | null> {
		try {
			const query = `SELECT * FROM users WHERE id = $1`;
			const value = [id];

			const res = await pool.query(query, value);

			return res.rows.length > 0 ? res.rows[0] : null;
		} catch (error) {
			console.error("Erreur lors de la récupération de l'utilisateur (Repositories): ", error);
			throw new Error("Impossible de récupérer l'utilisateur.")
		}
	}

	async findAll(): Promise<User[]> {
		try {
			const query = `SELECT * FROM users`;

			const res = await pool.query(query)

			return res.rows;
		} catch (error) {
			console.error("Erreur lors de la récupération de la liste des utilisateurs (Repositories): ", error);
			throw new Error("Impossible de récupérer la liste des utilisateurs.")
		}
	}

	async update(name: string, email: string, id: string): Promise<User | null> {
		try {
			const query = `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`;
			const values = [name, email, id];

			const res = await pool.query(query, values);

			return res.rows.length > 0 ? res.rows[0] : null;
		} catch (error) {
			console.error("Erreur lors de la mise à jour de l'utilisateur (Repositories): ", error);
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
			console.error("Erreur lors de la suppression de l'utilisateur (Repositories): ", error);
			throw new Error("Impossible de supprimer l'utilisateur.");
		}
	}

}

export default UserDb;
