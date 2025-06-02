import BoardService from '../api/v1/services/boardService.js';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour vérifier si l'utilisateur authentifié est propriétaire du tableau.
 *
 * Ce middleware extrait l'ID de l'utilisateur injecté dans la requête et le compare
 * à l'ID de l'utilisateur du tableau extrait. Si l'ID est valide, il enchaîne avec la suite des middlewares ou la gestion de requêtes. Si l'ID est invalide, une réponse avec un statut HTTP 403 est renvoyée pour interdire l'accès..
 *
 * @param {Request} req - La requête HTTP, enrichie avec l'ID de l'utilisateur.
 * @param {Response} res - La réponse HTTP qui sera renvoyé si l'ID des utilisateurs comparées ne correspond pas.
 *
 * returns {void} - Ne retourne rien, mais renvoie un message d'erreur si l'utilisateur n'est pas authentifié.
 */
async function authorizationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const connectedUserId = req.userId;
    const { boardId } = req.params;

    const boardService = new BoardService();
    const board = await boardService.getBoardById(boardId);
    if (!board || connectedUserId !== board.userId) {
        res.status(403).json({
            message:
                "Accès refusé: vous n'êtes pas le propriétaire de ce tableau.",
        });
        return;
    }

    next();
}

export default authorizationMiddleware;
