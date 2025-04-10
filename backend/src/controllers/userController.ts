import { Request, Response } from 'express';
import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';

class UserController {
	async createUser(req: Request, res: Response): Promise<void> {
		// Vérifier s'il y a des erreurs de validation
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Si des erreurs sont présentes, retourner les erreurs au client
			res.status(400).json({ errors: errors.array() });
			return;
		}

		const { name, email, password } = req.body;
		const userService = new UserService();

		try {
			const user = await userService.createUser(name, email, password);
			if (!user) {
				res.sendStatus(404);
				return;
			}

			res.status(201).json(user);
		} catch (error) {
			console.error("Erreur en créant l'utilisateur: ", error)
			res.sendStatus(500);
		}
	}

	async fetchUserById(req: Request, res: Response) {
		const { id } = req.params;

		const userService = new UserService();

		try {
			const user = await userService.getUserById(id);
			if (!user) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(user);
		} catch (error) {
			console.error("Erreur en allant chercher l'utilisateur: ", error)
			res.sendStatus(500);
		};
	}

	async fetchAllUsers(req: Request, res: Response) {
		const userService = new UserService();

		try {
			const users = await userService.getAllUsers();
			if (users.length === 0) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(users);
		} catch (error) {
			console.error("Erreur en allant chercher la liste des utilisateurs: ", error)
			res.sendStatus(500);
		}
	}

	async updateUser(req: Request, res: Response): Promise<void> {
		// Vérifier s'il y a des erreurs de validation
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Si des erreurs sont présentes, retourner les erreurs au client
			res.status(400).json({ errors: errors.array() });
			return;
		}
		const { id } = req.params;
		const { name, email } = req.body;

		const userService = new UserService();

		try {
			const updatedUser = await userService.updateUser(name, email, id)
			if (!updatedUser) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(updatedUser);
		} catch (error) {
			console.error("Erreur en mettant à jour l'utilisateur: ", error)
			res.sendStatus(500);
		}
	}

	async deleteUser(req: Request, res: Response) {
		const { id } = req.params;

		const userService = new UserService();

		try {
			const isDeleted = await userService.deleteUser(id)
			if (!isDeleted) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json({ message: "L'utilisateur a été supprimé avec succés." });
		} catch (error) {
			console.error("Erreur en mettant à jour l'utilisateur: ", error)
			res.sendStatus(500);
		}
	}

}

export default UserController;
