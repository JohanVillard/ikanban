import { Request, Response } from 'express';
import ColumnService from '../services/columnService';

class ColumnController {
    private columnService: ColumnService;

    constructor() {
        this.columnService = new ColumnService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    createColumn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            const { boardId } = req.params;

            const column = await this.columnService.createColumn(name, boardId);

            res.status(201).json(column);
        } catch (error: any) {
            console.error(`Erreur en créant la colonne: ${error}`);

            if (error.message === 'Ce nom de colonne est déjà utilisé.') {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    fetchColumnById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { colId } = req.params;

            const column = await this.columnService.getColumnById(colId);

            res.status(200).json(column);
        } catch (error: any) {
            console.error(`Erreur en récupérant la colonne: ${error}`);

            if (error.message === "La colonne n'a pas été trouvée.") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    fetchAllColumns = async (req: Request, res: Response): Promise<void> => {
        try {
            const columns = await this.columnService.getAllColumns();

            res.status(200).json(columns);
        } catch (error: any) {
            console.error(
                `Erreur en récupérant la liste des colonnes: ${error}`
            );

            if (error.message === "Aucune colonne n'est enregistrée.") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    fetchColumnsByBoardId = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { boardId } = req.params;

            const columns =
                await this.columnService.getColumnsByBoardId(boardId);

            res.status(200).json(columns);
        } catch (error: any) {
            console.error(
                `Erreur en récupérant la liste des colonnes d'un tableau: ${error}`
            );

            if (
                error.message ===
                "Aucune colonne n'est enregistrée dans ce tableau."
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    updateColumn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            const { colId } = req.params;

            const updatedBoard = await this.columnService.updateColumn(
                name,
                colId
            );

            res.status(200).json(updatedBoard);
        } catch (error: any) {
            console.error(`Erreur en modifiant la colonne: ${error}`);
            if (
                error.message ===
                'Impossible de modifier la colonne : le nom est déjà pris'
            ) {
                res.status(409).json({ error: error.message });
            } else if (
                error.message ===
                'Impossible de modifier la colonne : elle n’existe pas'
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    deleteColumn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { colId } = req.params;

            await this.columnService.deleteColumn(colId);

            res.status(200).json({
                message: 'La colonne a été supprimé avec succès.',
            });
        } catch (error: any) {
            console.error(`Erreur en modifiant la colonne: ${error}`);

            if (
                error.message === 'Aucun colonne correspondante n’a été trouvé.'
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };
}

export default ColumnController;
