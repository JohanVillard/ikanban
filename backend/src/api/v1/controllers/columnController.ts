import { Request, Response } from 'express';
import ColumnService from '../services/columnService.js';
import { validationResult } from 'express-validator';
import { Column } from 'types/column.js';

class ColumnController {
    private columnService: ColumnService;

    constructor() {
        this.columnService = new ColumnService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    createColumn = async (req: Request, res: Response): Promise<void> => {
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
            const { name, wip } = req.body;
            const { boardId } = req.params;

            const wipLimit = this.normalizeWipLimit(wip);

            console.log('wip: ', wipLimit);

            const column = await this.columnService.createColumn(
                name,
                wipLimit,
                boardId
            );

            res.status(201).json({ success: true, data: column });
        } catch (error: any) {
            console.error(`Erreur en créant la colonne: ${error}`);

            if (error.message === 'Ce nom de colonne est déjà utilisé') {
                res.status(409).json({ success: false, error: error.message });
            } else if (
                error.message ===
                `Le nombre de tâches autorisées doit être supérieure à zéro`
            ) {
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

    fetchColumnById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { colId } = req.params;

            const column = await this.columnService.getColumnById(colId);

            res.status(200).json(column);
        } catch (error: any) {
            console.error(`Erreur en récupérant la colonne: ${error}`);

            if (error.message === "La colonne n'a pas été trouvée") {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur' });
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

            res.status(200).json({ success: true, data: columns });
        } catch (error: any) {
            console.error(
                `Erreur en récupérant la liste des colonnes d'un tableau: ${error}`
            );

            if (
                error.message ===
                "Aucune colonne n'est enregistrée dans ce tableau."
            ) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    updateColumn = async (req: Request, res: Response): Promise<void> => {
        // Attrape le retour du middleware de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                success: false,
                errors: errors.mapped(), // Renvoie un objet au lieu d’un tableau
            });
            return;
        }

        try {
            const { name, wip } = req.body;
            const { colId } = req.params;

            const updatedBoard = await this.columnService.updateColumn(
                name,
                wip,
                colId
            );

            res.status(200).json({
                success: true,
                updatedBoard,
            });
        } catch (error: any) {
            console.error(`Erreur en modifiant la colonne: ${error}`);
            if (error.message === 'Ce nom de colonne est déjà utilisé') {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
            } else if (
                error.message ===
                `Le nombre autorisé doit dépasser le nombre de tâches actuelles`
            ) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
            } else if (
                error.message === 'La modification de la colonne a échouée'
            ) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
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

    normalizeWipLimit(wip: number | null | string | undefined): Column['wip'] {
        if (wip === '' || wip === undefined || wip === null) {
            return null;
        }

        return wip as number;
    }
}

export default ColumnController;
