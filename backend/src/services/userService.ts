import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import UserDb from "../repositories/userDb";

class UserService {
	async createUser(name: string, email: string, plainPassword: string): Promise<Partial<User>> {
		const salt = genSaltSync(10);
		const hash = hashSync(plainPassword, salt);

		const id = uuidv4();

		const userDb = new UserDb();

		const user = await userDb.getUserByMail(email);
		if (user) {
			throw new Error("L'email est déjà utilisé.")
		}

		try {
			const user = await userDb.createUser(id, name, email, hash)

			return {
				id: user.id,
				name: user.name,
				email: user.email,
			};
		} catch (error) {
			console.error("Erreur lors de la création de l'utilisateur (Service):", error);
			throw new Error("Impossible de créer l'utilisateur.");
		}
	}

	async verifyPassword(email: string, password: string): Promise<boolean> {
		const userDb = new UserDb();

		try {
			const user = await userDb.getUserByMail(email)
			if (!user) {
				throw new Error("L'utilisateur n'existe pas.");
			}

			const hash = user.passwordHash;
			console.log("hash: ", hash);


			return compareSync(password, hash);
		} catch (error) {
			console.error("Erreur lors de l'authentification de l'utilisateur (Service): ", error);
			throw new Error("Impossible d'authentifier l'utilisateur.");
		}
	}

	async getUserById(id: string): Promise<Partial<User>> {
		try {
			const userDb = new UserDb();

			const user = await userDb.getUserById(id);
			if (!user) {
				throw new Error("L'utilisateur n'existe pas.");
			}

			return {
				id: user.id,
				name: user.name,
				email: user.email,
			};
		} catch (error) {
			console.error("Erreur lors de la récupération de l'utilisateur: (Service)", error);
			throw new Error("Impossible de récupérer l'utilisateur.")
		}
	}

	async getAllUsers(): Promise<User[]> {
		try {
			const userDb = new UserDb();

			const users = await userDb.findAll();
			if (users.length === 0) {
				throw new Error("Aucun utilisateur n'est enregistré.");
			}

			return users;
		} catch (error) {
			console.error("Erreur lors de la récupération de la liste des utilisateurs: (Service)", error);
			throw new Error("Impossible de récupérer la liste des utilisateurs.")
		}
	}

	async updateUser(name: string, email: string, id: string): Promise<Partial<User>> {
		try {
			const userDb = new UserDb();

			const updatedUser = await userDb.updateUser(name, email, id);
			if (!updatedUser) {
				throw new Error("L'utilisateur n'existe pas.");
			}

			return {
				id: updatedUser.id,
				name: updatedUser.name,
				email: updatedUser.email,
			};
		} catch (error) {
			console.error("Erreur lors de la mise à jour de l'utilisateur: (Service)", error);
			throw new Error("Impossible de mettre à jour l'utilisateur.");
		}
	}

	async deleteUser(id: string): Promise<boolean> {
		try {
			const userDb = new UserDb();

			const userDeleted = await userDb.deleteUser(id);
			if (!userDeleted) {
				throw new Error("L'utilisateur n'existe pas.");
			}

			return userDeleted;
		} catch (error) {
			console.error("Erreur lors de la suppression de l'utilisateur: (Service)", error);
			throw new Error("Impossible de supprimer l'utilisateur.");
		}
	}
}

export default UserService;
