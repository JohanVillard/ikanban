import { Request, Response } from 'express';
import BoardService from '../services/boardService';

class BoardController {
    private boardService: BoardService;

    constructor() {
        this.boardService = new BoardService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    createBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            const userId = req.userId;

            if (userId) {
                const board = await this.boardService.createBoard(name, userId);

                res.status(201).json(board);
                return;
            }

            res.status(500).json({ error: "Pas d'ID dans le token." });
        } catch (error: any) {
            console.error('Erreur en créant le tableau: ', error);

            if (error.message === 'Ce nom de tableau existe déjà.') {
                res.status(409).json({ error: error.message });
            } else {
                res.sendStatus(500).json('Erreur serveur.');
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
                res.sendStatus(500).json('Erreur serveur.');
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
                res.sendStatus(500).json({ error: 'Erreur serveur.' });
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
                res.sendStatus(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    updateBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            const { boardId } = req.params;

            const updatedBoard = await this.boardService.updateBoard(
                name,
                boardId
            );

            res.status(200).json(updatedBoard);
        } catch (error: any) {
            console.error('Erreur en mettant à jour le tableau: ', error);

            if (
                error.message ===
                'Impossible de modifier le tableau : il n’existe pas ou les données sont identiques.'
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.sendStatus(500).json({ error: 'Erreur serveur.' });
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
                res.sendStatus(500).json({ error: 'Erreur serveur.' });
            }
        }
    };
}

export default BoardController;
