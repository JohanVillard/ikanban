import { Request, Response } from 'express';
import UserService from '../services/userService.js';
import { validationResult } from 'express-validator';
import { NewUser } from 'types/user.js';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    // D'où l'utilisation d'une fonction fléchée
    registerUser = async (req: Request, res: Response): Promise<void> => {
        // Vérifier s'il y a des erreurs de validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                errors: errors.mapped(), // Renvoie un objet au lieu d’un tableau
            });
            return;
        }

        const newUser: NewUser = req.body;

        try {
            const user = await this.userService.createUser(newUser);

            if (!user) {
                res.sendStatus(404);
                return;
            }

            res.status(201).json({
                success: true,
                message: 'Votre compte a été créé',
                data: user,
            });
        } catch (error: any) {
            console.error("Erreur en créant l'utilisateur: ", error);

            if (error.message === 'Impossible de créer le compte') {
                res.status(409).json({ success: false, error: error.message });
            } else if (
                error.message ===
                'Le mot de passe et sa confirmation ne correspondent pas'
            ) {
                res.status(400).json({ success: false, error: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur inconnue',
                });
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
            res.status(400).json({ success: false, errors: errors.mapped() });
            return;
        }
        const id = req.userId;
        if (!id) {
            res.status(401).json({ success: false, error: 'Token manquant' });
            return;
        }

        const { name, email } = req.body;

        try {
            const updatedUser = await this.userService.updateUser(
                name,
                email,
                id
            );

            res.status(200).json({
                success: true,
                data: updatedUser,
                message: 'Vos données ont été mise à jour',
            });
        } catch (error: any) {
            console.error("Erreur en mettant à jour l'utilisateur: ", error);

            if (
                error.message ===
                'Aucune modification détectée, données identiques'
            ) {
                res.status(200).json({ success: true, message: error.message });
            } else if (error.message === 'Utilisateur non trouvé') {
                res.status(404).json({ success: false, error: error.message });
            } else {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        const id = req.userId;
        if (!id) {
            res.status(401).json({ message: 'Token manquant' });
            return;
        }

        try {
            await this.userService.deleteUser(id);

            res.status(200).json({
                success: true,
                message: "L'utilisateur a été supprimé avec succés",
            });
        } catch (error: any) {
            console.error("Erreur en mettant à jour l'utilisateur: ", error);

            if (error.message === 'Utilisateur introuvable') {
                res.status(403).json({
                    success: false,
                    error: 'Utilisateur introuvable',
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur',
                });
            }
        }
    };

    loginUser = async (req: Request, res: Response): Promise<void> => {
        // Vérifier s'il y a des erreurs de validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                errors: errors.mapped(), // ← renvoie un objet au lieu d’un tableau
            });
            return;
        }

        const { email, password } = req.body;

        try {
            const user = await this.userService.verifyCredentials(
                email,
                password
            );

            const token = this.userService.generateJWT(user.id);
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

            res.status(200).json({
                success: true,
                message: 'Vous êtes connecté.',
            });
        } catch (error: any) {
            console.error(`Erreur en connectant l'utilisateur: ${error}`);

            if (error.message === 'Les identifiants sont invalides') {
                res.status(401).json({
                    success: false,
                    error: error.message,
                });
            } else if (error.message === 'Email ou mot de passe requis') {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur',
                });
            }
        }
    };

    logoutUser = async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'lax',
                path: '/', // Supprimer le cookie peu importe la page où on se trouve
            });

            res.status(200).json({
                success: true,
                message: 'Déconnecté avec succès',
            });
        } catch (error) {
            console.error(`Problème lors de la déconnexion ${error}`);
            res.status(500).json({ success: false, error: 'Erreur serveur' });
        }
    };

    userProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.userId;
            if (!id) {
                res.status(401).json({ message: 'Token manquant' });
                return;
            }

            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: "L'utilisateur n'a pas été trouvé",
                });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    };
}

export default UserController;
