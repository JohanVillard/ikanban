import { JwtPayload } from 'jsonwebtoken';

export {};

/**
 * Étend l'interface 'Express.Request' pour inclure des propriétés personnalisées.
 *
 * Ici, on ajoute `userId`, qui est ajouté dans la requête par `authmiddleware`.
 *
 * Permet à TypeScript de reconnaître `req.userId` comme une propriété valide.
 */
declare global {
    namespace Express {
        export interface Request {
            userId?: string;
        }
    }
}
