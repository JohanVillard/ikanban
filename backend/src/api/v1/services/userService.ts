import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { NewUser, User, UserDbRecord } from '../../../types/user.js';
import UserDb from '../repositories/userDb.js';
import config from '../../../config/config.js';

/**
 * Service pour gérer les opérations liées aux utilisateurs.
 */
class UserService {
    /**
     * Instance du gestionnaire de la base de données des utilisateurs.
     */
    private userDb: UserDb;

    /**
     * Initialise une nouvelle instance du service utilisateur.
     *
     * @param userDb - L'instance de UserDb pour accéder aux données utilisateurs.
     */
    constructor() {
        this.userDb = new UserDb();
    }

    /**
     * Crée un nouvel utilisateur.
     * Vérifie si l'adresse e-mail est déjà utilisée.
     * Vérifie si le mot de passe et la confirmation du mot de passe correspondent.
     * Hache le mot de passe avant de l'enregistrer.
     *
     * @async
     * @param newUser - L'objet contenant les données du nouvel utilisateur.
     * Doit contenir les propriétés `name`, `email`, `password` et `passconf`.
     * @returns Le nouvel utilisateur.
     * @throws {Error} Lance une erreur si l'adresse e-mail est déjà utilisée, si les mots de passe ne correspondent pas, si la création de l'utilisateur échoue.
     */
    async createUser(newUser: NewUser): Promise<Omit<User, 'passwordHash'>> {
        // 1. Déstructuration de newUser
        const { name, email, password, passconf } = newUser;

        try {
            // 2. Validation
            await this.ensureUniqueEmail(email);
            this.validatePasswordsMatch(password, passconf);

            // 3. Hachage du mot de passe
            const passwordHash = this.hashPassword(10, password);

            // 4. Création d'un identifiant
            const id = uuidv4();

            // 5. Création de l'utilisateur
            const user = await this.userDb.create({
                id,
                name,
                email,
                passwordHash,
            });
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

    /**
     * Vérifie que le mot de passe et sa confirmation sont identiques.
     *
     * @param password- Le mot de passe non haché de l'utilisateur.
     * @param passconf - La confirmation du mot de passe.
     *
     * @throws {Error} - Si les mots de passe ne correspondent pas.
     */
    protected validatePasswordsMatch(password: string, passconf: string): void {
        if (password !== passconf) {
            throw new Error(
                'Le mot de passe et sa confirmation ne correspondent pas'
            );
        }
    }

    /**
     * Hache le mot de passe de l'utilisateur.
     *
     * @param saltRounds - Le nombre de rounds pour le sel.
     * @param plainPassword - Le mot de passe à hacher.
     * @returns Le mot de passe haché.
     */
    protected hashPassword(saltRounds: number, plainPassword: string): string {
        const salt = genSaltSync(saltRounds);
        return hashSync(plainPassword, salt);
    }

    /**
     * Vérifie que l'adresse e-mail n'est pas déjà utilisée.
     *
     * @param email - L'adresse à vérifier.
     * @throws {Error} - Si l'adresse e-mail existe déjà dans la base de données.
     */
    protected async ensureUniqueEmail(email: string): Promise<void> {
        const user = await this.userDb.findByMail(email);
        if (user) {
            throw new Error('Impossible de créer le compte');
        }
    }

    /**
     * Vérifie les informations d'identification de l'utilisateur.
     *
     * Étapes :
     * - Vérifie que l'e-mail et le mot de passe sont fournis.
     * - Récupère l'utilisateur correspondent à l'e-mail.
     * - Vérifie le mot de passe.
     * - Supprime le mot de passe haché de l'objet utilisateur.
     *
     * @param email - L'adresse e-mail de l'utilisateur.
     * @param password - Le mot de passe en clair fourni de l'utilisateur.
     * @returns L'utilisateur sans le mot de passe.
     * @throws {Error} Si les identifiants sont invalides ou manquant.
     */
    async verifyCredentials(
        email: string,
        password: string
    ): Promise<Omit<User, 'passwordHash'>> {
        try {
            // 1. Validation
            this.validateCredentialsProvided(email, password);

            // 2. Récupération
            const user = await this.getUserByMail(email);

            // 3. Comparaison du mot de passe
            this.verifyPassword(password, user.password_hash);

            // 4. Suppression du mot de passe de la réponse
            return this.excludePassword(user);
        } catch (error) {
            console.error(
                "Erreur lors de l'authentification de l'utilisateur (Service): ",
                error
            );
            throw error;
        }
    }

    /**
     * Vérifie si les données de connexion de l'utilisateur sont fournies.
     *
     * @param email - L'adresse e-mail de l'utilisateur.
     * @param password - Le mot de passe de l'utilisateur.
     * @throws {Error} Si les identifiants sont une chaîne de caractères vide.
     */
    protected validateCredentialsProvided(
        email: string,
        password: string
    ): void {
        if (email.length === 0 || password.length === 0) {
            throw new Error('Email ou mot de passe requis');
        }
    }

    /**
     * Récupère l'utilisateur par son e-mail.
     *
     * @param email - L'email de l'utilisateur.
     * @returns L'utilisateur trouvé dans la base de donnée.
     * @throws {Error} Si aucun utilisateur n'est associé à cette adresse e-mail.
     */
    protected async getUserByMail(email: string): Promise<UserDbRecord> {
        const user = await this.userDb.findByMail(email);
        if (!user) {
            throw new Error('Les identifiants sont invalides');
        }

        return user;
    }

    /**
     * Vérifie que le mot de passe de l'utilisateur correspond au mot de passe haché stocké.
     *
     * @param password - Le mot de passe de l'utilisateur.
     * @param hashedPassword - Le mot de passe haché trouvé dans la base de donnée.
     * @throws {Error} Si les mots de passe ne correspondent pas.
     */
    protected verifyPassword(password: string, hashedPassword: string): void {
        const isValid = compareSync(password, hashedPassword);
        if (!isValid) {
            throw new Error('Les identifiants sont invalides');
        }
    }

    /**
     * Supprime la propriété du mot de passe haché de l'objet utilisateur,
     * que ce soit sous la forme `password_hash` (base de données)
     * ou `passwordHash` (objet métier).
     *
     * @param user - L'utilisateur à modifier.
     * @returns L'utilisateur sans mot de passe haché.
     * @throws {Error} Si aucune propriété de mot de passe haché n'est trouvée.
     */
    protected excludePassword(
        user: UserDbRecord | User
    ): Omit<User, 'passwordHash'> {
        if ('password_hash' in user) {
            const { password_hash, ...userWithoutPassword } = user;

            return userWithoutPassword;
        } else if ('passwordHash' in user) {
            const { passwordHash, ...userWithoutPassword } = user;

            return userWithoutPassword;
        }
        throw new Error('Erreur: propriété de mot de passe haché introuvable');
    }

    /**
     * Récupère l'utilisateur par son identifiant.
     *
     * @param id - L'identifiant de l'utilisateur.
     * @returns L'utilisateur sans le mot de passe haché.
     * @throws {Error} Si l'utilisateur n'est pas trouvé dans la base de données.
     */
    async getUserById(id: string): Promise<Omit<User, 'passwordHash'>> {
        try {
            const user = await this.userDb.findById(id);
            if (!user) {
                throw new Error("L'utilisateur n'existe pas");
            }

            return this.excludePassword(user);
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

    /**
     * Met à jour le nom et l'email d'un utilisateur existant.
     *
     * @param name - Le nouveau nom de l'utilisateur.
     * @param email - La nouvelle adresse e-mail de l'utilisateur.
     * @param id - L'identifiant de l'utilisateur à mettre à jour.
     * @returns L'utilisateur mis à jour sans le mot de passe haché.
     * @throws {Error} Si aucune modification n'est détectée.
     * @throws {Error} Si l'adresse e-mail est déjà utilisée.
     * @throws {Error} Si l'utilisateur n'existe pas.
     * @throws {Error} En cas d'erreur lors de la mise à jour.
     */
    async updateUser(
        name: string,
        email: string,
        id: string
    ): Promise<Omit<User, 'passwordHash'>> {
        try {
            const userToUpdate = await this.getUserById(id);

            if (userToUpdate.name === name && userToUpdate.email === email) {
                throw new Error(
                    'Aucune modification détectée, données identiques'
                );
            }

            if (userToUpdate.email !== email) {
                await this.ensureUniqueEmail(email);
            }

            const dbUpdatedUser = await this.userDb.update(name, email, id);
            if (!dbUpdatedUser) {
                throw new Error("L'utilisateur n'existe pas.");
            }

            return this.excludePassword(dbUpdatedUser);
        } catch (error) {
            console.error(
                "Erreur lors de la mise à jour de l'utilisateur: (Service)",
                error
            );
            throw error;
        }
    }

    /**
     * Supprime un utilisateur par son identifiant.
     *
     * @param id - L'identifiant unique de l'utilisateur à supprimer.
     * @returns `true` si la suppression a réussi.
     * @throws {Error} Si l'utilisateur n'a pas été trouvé ou si la suppression a échoué.
     */
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

    /**
     * Génère un jeton JWT pour un utilisateur.
     *
     * Le jeton contient l'identifiant de l'utilisateur dans son payload
     * et est signé par un clé secrète définie dans la configuration.
     * Le jeton expire après 1 heure.
     *
     * @param userId - L'identifiant de l'utilisateur.
     * @returns Une reorésentant le JWT.
     * @throws {Error} Si la génération du jeton échoue.
     *
     */
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
}

export default UserService;
