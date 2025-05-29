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
        plainPassword: string,
        confirmationPassword: string
    ): Promise<Omit<User, 'passwordHash'>> {
        this.validatePasswordsMatch(plainPassword, confirmationPassword);

        const hashedPassword = this.hashPassword(10, plainPassword);

        const id = uuidv4();

        try {
            await this.ensureUniqueEmail(email);

            const user = await this.userDb.create(
                id,
                name,
                email,
                hashedPassword
            );
            if (!user) {
                throw new Error("La création de l'utilisateur a échoué");
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

    validatePasswordsMatch(
        plainPassword: string,
        confirmationPassword: string
    ): void {
        if (plainPassword !== confirmationPassword) {
            console.log(plainPassword + ' vs ' + confirmationPassword);

            throw new Error('Les mots de passe ne correspondent pas');
        }
    }

    hashPassword(salt: number, plainPassword: string): string {
        const s = genSaltSync(salt);
        return hashSync(plainPassword, s);
    }

    async ensureUniqueEmail(email: string): Promise<void> {
        const user = await this.userDb.findByMail(email);
        if (user) {
            throw new Error('Impossible de créer le compte');
        }
    }

    async verifyCredentials(
        email: string,
        password: string
    ): Promise<Omit<User, 'passwordHash'>> {
        Promise<{ id: string; name: string; email: string } | null>;
        try {
            if (email.length === 0 || password.length === 0) {
                throw new Error('Email ou mot de passe requis');
            }

            const user = await this.userDb.findByMail(email);
            if (!user) {
                throw new Error('Les identifiants sont invalides');
            }

            const hash = user.password_hash;

            const isValid = compareSync(password, hash);
            console.log(isValid);

            if (!isValid) {
                throw new Error('Les identifiants sont invalides');
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
                throw new Error("L'utilisateur n'existe pas");
            }

            const { password_hash, ...userWithoutPassword } = user;

            return userWithoutPassword;
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
                'Impossible de récupérer la liste des utilisateurs'
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
                throw new Error('Utilisateur non trouvé');
            }
            if (userToUpdate.name === name && userToUpdate.email === email) {
                throw new Error(
                    'Aucune modification détectée, données identiques'
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
            throw error;
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const isUserDeleted = await this.userDb.delete(id);
            if (!isUserDeleted) {
                throw new Error('Utilisateur introuvable');
            }

            return isUserDeleted;
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de l'utilisateur: (Service)",
                error
            );
            throw error;
        }
    }
}

export default UserService;
