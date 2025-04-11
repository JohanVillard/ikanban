import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user';
import UserDb from "../repositories/userDb";

class UserService {
	private userDb: UserDb;

	constructor() {
		this.userDb = new UserDb();
	}

	async createUser(name: string, email: string, plainPassword: string): Promise<Partial<User>> {
		const salt = genSaltSync(10);
		const hash = hashSync(plainPassword, salt);

		const id = uuidv4();

		const user = await this.userDb.findByMail(email);
		if (user) {
			throw new Error("Impossible de créer le compte.");
		}

		try {
			const user = await this.userDb.create(id, name, email, hash)
			if (!user) {
				throw new Error("La création de l'utilisateur a échoué.")
			}

			return {
				id: user.id,
				name: user.name,
				email: user.email,
			};
		} catch (error) {
			console.error("Erreur lors de la création de l'utilisateur (Service):", error);
			throw error;
		}
	}

	async verifyPassword(email: string, password: string): Promise<boolean> {
		try {
			const user = await this.userDb.findByMail(email)
			if (!user) {
				throw new Error("L'utilisateur n'existe pas.");
			}

			const hash = user.passwordHash;

			return compareSync(password, hash);
		} catch (error) {
			console.error("Erreur lors de l'authentification de l'utilisateur (Service): ", error);
			throw new Error("Impossible d'authentifier l'utilisateur.");
		}
	}

	async getUserById(id: string): Promise<Partial<User>> {
		try {
			const user = await this.userDb.findById(id);
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
			const users = await this.userDb.findAll();
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
			const updatedUser = await this.userDb.update(name, email, id);
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
			const userDeleted = await this.userDb.delete(id);
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
