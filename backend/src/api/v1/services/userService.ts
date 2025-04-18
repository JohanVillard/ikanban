import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { User } from '../../../types/user';
import UserDb from '../repositories/userDb';
import config from '../../../config/config';

class UserService {
    private userDb: UserDb;

    constructor() {
        this.userDb = new UserDb();
    }

    async createUser(
        name: string,
        email: string,
        plainPassword: string
    ): Promise<Partial<User>> {
        const salt = genSaltSync(10);
        const hash = hashSync(plainPassword, salt);

        const id = uuidv4();

        const user = await this.userDb.findByMail(email);
        if (user) {
            throw new Error('Impossible de créer le compte.');
        }

        try {
            const user = await this.userDb.create(id, name, email, hash);
            if (!user) {
                throw new Error("La création de l'utilisateur a échoué.");
            }

            return {
                id: user.id,
                name: user.name,
                email: user.email,
            };
        } catch (error) {
            console.error(
                "Erreur lors de la création de l'utilisateur (Service):",
                error
            );
            throw error;
        }
    }

    async verifyCredentials(
        email: string,
        password: string
    ): Promise<Omit<User, 'passwordHash'>> {
        Promise<{ id: string; name: string; email: string } | null>;
        try {
            const user = await this.userDb.findByMail(email);
            if (!user) {
                throw new Error("L'utilisateur n'existe pas.");
            }

            const hash = user.password_hash;

            const isValid = compareSync(password, hash);
            if (!isValid) {
                throw new Error('Les identifiants sont invalides.');
            }

            // On retire le mot de passe avant de retourner user
            const { password_hash, ...userWithoutPassword } = user;

            return userWithoutPassword;
        } catch (error) {
            console.error(
                "Erreur lors de l'authentification de l'utilisateur (Service): ",
                error
            );
            throw error;
        }
    }

    generateJWT(userId: string): string {
        try {
            const token = jwt.sign({ userId: userId }, config.jwt_secret, {
                expiresIn: '1h',
            });

            return token;
        } catch (error) {
            console.error(
                "Erreur lors de l'authentification de l'utilisateur (Service): ",
                error
            );
            throw new Error('Impossible de générer un jeton.');
        }
    }

    async getUserById(id: string): Promise<Omit<User, 'passwordHash'>> {
        try {
            const user = await this.userDb.findById(id);
            if (!user) {
                throw new Error("L'utilisateur n'existe pas.");
            }

            return user;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération de l'utilisateur: (Service)",
                error
            );
            throw new Error("Impossible de récupérer l'utilisateur.");
        }
    }

    async getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
        try {
            const dbUsers = await this.userDb.findAll();
            if (dbUsers.length === 0) {
                throw new Error("Aucun utilisateur n'est enregistré.");
            }

            const usersWithoutPassword = dbUsers.map(
                ({ password_hash, ...user }) => ({
                    ...user,
                })
            );

            return usersWithoutPassword;
        } catch (error) {
            console.error(
                'Erreur lors de la récupération de la liste des utilisateurs: (Service)',
                error
            );
            throw new Error(
                'Impossible de récupérer la liste des utilisateurs.'
            );
        }
    }

    async updateUser(
        name: string,
        email: string,
        id: string
    ): Promise<Omit<User, 'passwordHash'>> {
        try {
            const userToUpdate = await this.userDb.findById(id);
            if (!userToUpdate) {
                throw new Error(
                    "Impossible de modifier l'utilisateur: il n'existe pas"
                );
            }
            if (userToUpdate.name === name && userToUpdate.email) {
                throw new Error(
                    "Impossible de modifier l'utilisateur: le nom et l'email sont identiques"
                );
            }

            const dbUpdatedUser = await this.userDb.update(name, email, id);
            if (!dbUpdatedUser) {
                throw new Error("L'utilisateur n'existe pas.");
            }

            const { password_hash, ...updatedUser } = dbUpdatedUser;

            return updatedUser;
        } catch (error) {
            console.error(
                "Erreur lors de la mise à jour de l'utilisateur: (Service)",
                error
            );
            throw new Error("Impossible de mettre à jour l'utilisateur.");
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const isUserDeleted = await this.userDb.delete(id);
            if (!isUserDeleted) {
                throw new Error("L'utilisateur n'existe pas.");
            }

            return isUserDeleted;
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de l'utilisateur: (Service)",
                error
            );
            throw new Error("Impossible de supprimer l'utilisateur.");
        }
    }
}

export default UserService;
