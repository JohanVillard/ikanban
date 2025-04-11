import pool from "../config/connectDB";
import Board from "models/board";

class BoardDb {
	async create(id: string, name: string, userId: string): Promise<Board> {
		try {
			const query = 'INSERT INTO boards (id, name, user_id) VALUES ($1, $2, $3) RETURNING *';
			const values = [id, name, userId];

			const res = await pool.query(query, values);
			console.log(res.rows);

			return res.rows[0];
		} catch (error) {
			console.error("Erreur lors de la création du tableau (Repositories): ", error)
			throw new Error("Impossible de créer un tableau.")
		}
	}

	async findById(id: string): Promise<Board | null> {
		try {
			const query = 'SELECT * FROM boards WHERE id = $1';
			const value = [id];

			const res = await pool.query(query, value);

			return res.rows.length > 0 ? res.rows[0] : null;
		} catch (error) {
			console.error("Erreur lors de la récupération du tableau (Repositories): ", error)
			throw new Error("Impossible de récupérer le tableau.")
		}
	};

	async findAll(): Promise<Board[]> {
		try {
			const query = 'SELECT * from boards';

			const res = await pool.query(query);

			return res.rows;
		} catch (error) {
			console.error("Erreur lors de la récupération de la liste des tableaux (Repositories): ", error);
			throw new Error("Impossible de récupérer la liste des tableaux.");
		}
	};

	async findByUserId(userId: string): Promise<Board[]> {
		try {
			const query = 'SELECT * from boards WHERE user_id = $1';
			const value = [userId];

			const res = await pool.query(query, value);
			console.log(res.rows);

			if (res.rows.length === 0) {
				console.log("Aucun tableau trouvé pour cet utilisateur.")
				return [];
			}

			return res.rows;
		} catch (error) {
			console.error("Erreur lors de la récupération de la liste des tableaux de l'utilisateur (Repositories): ", error)
			throw new Error("Impossible de récupérer la liste des tableaux de l'utilisateur.")
		}
	};

	async findByNameAndByUserId(name: string, userId: string): Promise<Board> {
		try {
			const query = 'SELECT * FROM boards WHERE name = $1 AND user_id =$2';
			const value = [name, userId];

			const res = await pool.query(query, value);

			return res.rows[0];
		} catch (error) {
			console.error("Erreur lors de la récupération du tableau de l'utilisateur (Repositories): ", error)
			throw new Error("Impossible de récupérer le tableau de l'utilisateur.")
		}
	}

	async update(name: string, id: string): Promise<Board | null> {
		try {
			const query = 'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *';
			const value = [name, id];

			console.log(value);


			const res = await pool.query(query, value);
			console.log(res.rows[0]);


			return res.rows.length > 0 ? res.rows[0] : null;
		} catch (error) {
			console.error("Erreur lors de la mise à jour du tableau (Repositories): ", error)
			throw new Error("Impossible de mettre à jour le tableau.")
		}
	};

	async delete(id: string): Promise<boolean> {
		try {
			const query = 'DELETE FROM boards WHERE id = $1';
			const value = [id];

			const res = await pool.query(query, value);

			return res.rowCount === 1;
		} catch (error) {
			console.error("Erreur lors de la suppression du tableau (Repositories): ", error)
			throw new Error("Impossible de suppression du tableau.")
		}
	};
}

export default BoardDb;
