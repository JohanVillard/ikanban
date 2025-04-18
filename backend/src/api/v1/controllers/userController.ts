import { Request, Response } from 'express';
import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    registerUser = async (req: Request, res: Response): Promise<void> => {
        // Vérifier s'il y a des erreurs de validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Si des erreurs sont présentes, retourner les erreurs au client
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email, password } = req.body;

        try {
            const user = await this.userService.createUser(
                name,
                email,
                password
            );

            if (!user) {
                res.sendStatus(404);
                return;
            }

            res.status(201).json(user);
        } catch (error: any) {
            console.error("Erreur en créant l'utilisateur: ", error);

            if (error.message === 'Impossible de créer le compte.') {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur inconnue.' });
            }
        }
    };

    fetchUserById = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;

        try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            console.error("Erreur en allant chercher l'utilisateur: ", error);
            res.sendStatus(500);
        }
    };

    fetchAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            if (users.length === 0) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(users);
        } catch (error) {
            console.error(
                'Erreur en allant chercher la liste des utilisateurs: ',
                error
            );
            res.sendStatus(500);
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        // Vérifier s'il y a des erreurs de validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Si des erreurs sont présentes, retourner les erreurs au client
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { id } = req.params;
        const { name, email } = req.body;

        try {
            const updatedUser = await this.userService.updateUser(
                name,
                email,
                id
            );
            if (!updatedUser) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Erreur en mettant à jour l'utilisateur: ", error);
            res.sendStatus(500);
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        try {
            const isDeleted = await this.userService.deleteUser(id);
            if (!isDeleted) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json({
                message: "L'utilisateur a été supprimé avec succés.",
            });
        } catch (error) {
            console.error("Erreur en mettant à jour l'utilisateur: ", error);
            res.sendStatus(500);
        }
    };

    loginUser = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            const user = await this.userService.verifyCredentials(
                email,
                password
            );

            const token = this.userService.generateJWT(user.id);

            res.status(200).json({
                sucess: true,
                data: token,
                message: 'Vous êtes connecté.',
            });
        } catch (error: any) {
            console.error(`Erreur en connectant l'utilisateur: ${error}`);

            if (error.message === '') {
                res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur' });
            }
        }
    };
}

export default UserController;
