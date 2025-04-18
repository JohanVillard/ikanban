import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware pour vérifier que l'utilisateur est authentifié via un token JWT.
 *
 * Ce middleware extrait le token JWT de l'en-tête `Authorization`, le vérifie et
 * extrait l'ID de l'utilisateur. Si le token est valide, il ajoute l'ID de l'utilisateur
 * à la requête sous `req.userId`. Si le token est absent ou invalide, une réponse
 * avec un statut HTTP 401 est renvoyée.
 *
 * @param {Request} req - La requête HTTP, enrichie avec l'ID de l'utilisateur si le token est valide.
 * @param {Response} res - La réponse HTTP qui sera renvoyée si le token est invalide.
 * @param {NextFunction} next - Fonction qui permet de passer au middleware suivant si le token est valide.
 *
 * @returns {void} - Ne retourne rien, mais modifie la requête et la réponse en cas d'erreur.
 *
 * @throws {Error} - Si le token est invalide ou expiré, une réponse avec un statut 403 est renvoyée.
 */
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Accès refusé. Token introuvable.' });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(404).json({ error: 'Configuration serveur invalide.' });
            return;
        }
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // On attache l'id de l'utilisateur à la requête
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(`Erreur lors de la vérification du token: ${error}`);
        res.status(403).json({ error: 'Token invalide ou expiré.' });
        return;
    }
}

export default authMiddleware;
