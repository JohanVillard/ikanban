import { Request, Response } from 'express';
import BoardService from '../services/boardService.js';
import { validationResult } from 'express-validator';

class BoardController {
    private boardService: BoardService;

    constructor() {
        this.boardService = new BoardService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    // D'où l'utilisation d'une fonction fléchée
    createBoard = async (req: Request, res: Response): Promise<void> => {
        // Vérifier s'il y a des erreurs de validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                errors: errors.mapped(), // Renvoie un objet au lieu d’un tableau
            });
            return;
        }

        try {
            const { name } = req.body;
            const userId = req.userId;

            if (userId) {
                const board = await this.boardService.createBoard(name, userId);

                res.status(201).json({ success: true, data: board });
                return;
            }
        } catch (error: any) {
            console.error('Erreur en créant le tableau: ', error);

            if (error.message === 'Ce nom de tableau existe déjà') {
                res.status(409).json({ success: false, error: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur indéfinie du serveur',
                });
            }
        }
    };

    fetchBoardById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { boardId } = req.params;

            const board = await this.boardService.getBoardById(boardId);

            res.status(200).json(board);
        } catch (error: any) {
            console.error('Erreur en récupérant le tableau: ', error);

            if (error.message === "Le tableau n'a pas été trouvé.") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json('Erreur serveur.');
            }
        }
    };

    fetchAllBoards = async (req: Request, res: Response): Promise<void> => {
        try {
            const boards = await this.boardService.getAllBoards();

            res.status(200).json(boards);
        } catch (error: any) {
            console.error(
                'Erreur en récupérant la liste de tous les tableaux: ',
                error
            );

            if (error.message === "Aucun tableau n'est enregistré.") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    fetchBoardsByUserId = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({
                    error: "L'utilisateur n'est pas authentifié.",
                });
                return;
            }

            // On récupère l'id de l'utilisateur fournit par le token et insérer dans la réponse
            const id = req.userId;

            const boards = await this.boardService.getBoardsByUserId(id);

            res.status(200).json(boards);
        } catch (error: any) {
            console.error(
                "Erreur en récupérant la liste des tableaux de l'utilisateur: ",
                error
            );

            if (
                error.message ===
                "Aucun tableau n'est enregistré pour cet utilisateur."
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    updateBoard = async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                errors: errors.mapped(), // Renvoie un objet au lieu d’un tableau
            });
            return;
        }

        try {
            const { name } = req.body;
            const { boardId } = req.params;

            const updatedBoard = await this.boardService.updateBoard(
                name,
                boardId
            );

            res.status(200).json({ success: true, data: updatedBoard });
        } catch (error: any) {
            console.error('Erreur en mettant à jour le tableau: ', error);

            if (error.message === "Le tableau n'existe pas") {
                res.status(404).json({ success: false, error: error.message });
            } else if (error.message === 'Le nom du tableau est déjà pris') {
                res.status(409).json({ succes: false, error: error.message });
            } else {
                res.status(500).json({
                    succes: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    deleteBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { boardId } = req.params;

            await this.boardService.deleteBoard(boardId);

            res.status(200).json({
                message: 'Le tableau a été supprimé avec succès.',
            });
        } catch (error: any) {
            console.error('Erreur en supprimant le tableau: ', error);

            if (
                error.message === 'Aucun tableau correspondant n’a été trouvé.'
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };
}

export default BoardController;
