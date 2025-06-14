import { v4 as uuidv4 } from 'uuid';
import ColumnDb from '../repositories/columnDb.js';
import { Column, ColumnValidationInput } from '../../../types/column.js';
import TaskDb from '../repositories/taskDb.js';

class ColumnService {
    private columnDb: ColumnDb;
    private taskDb: TaskDb;

    constructor() {
        this.columnDb = new ColumnDb();
        this.taskDb = new TaskDb();
    }

    /**
     * Crée une colonne dans un tableau.
     *
     * @param name - Le nom de la colonne.
     * @param wip - La limite de tâches (Work In Progress).
     * @param boardId - L'identifiant du tableau propriétaire.
     * @throws Error - Si la création de la colonne a échoué.
     * @returns column - La colonne créée.
     */
    async createColumn(
        name: string,
        wip: number | null,
        boardId: string
    ): Promise<Column> {
        try {
            // 1. Validation
            await this.validateColumn({ name, wip, boardId });

            // 2. Création
            const id = uuidv4();
            const columnDb = await this.columnDb.create(id, boardId, name, wip);
            if (!columnDb) {
                throw new Error('La création de la colonne a échoué');
            }

            // 3. Transformation des données
            const column = this.formatColumn(columnDb);

            return column;
        } catch (error) {
            console.error(
                `Erreur lors de la création de la colonne (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Récupère la colonne par son identifiant.
     *
     * @param id - L'identifiant de la colonne.
     * @returns column - La colonne récupérée.
     */
    async getColumnById(id: string): Promise<Column> {
        try {
            // 1. Récupération
            const columnDb = await this.columnDb.findById(id);
            if (!columnDb) {
                throw new Error("La colonne n'a pas été trouvée");
            }

            // 2. Transformation des données
            const column = this.formatColumn(columnDb);

            return column;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la colonne (Service): ${error}`
            );
            throw error;
        }
    }

    // ToDo: Bloquer pour la prod
    async getAllColumns(): Promise<Column[]> {
        try {
            const dbColumns = await this.columnDb.findAll();
            if (!dbColumns) {
                throw new Error("Aucune colonne n'est enregistrée.");
            }

            const cols = dbColumns.map((col) => {
                const { board_id, ...columnWithoutBoardId } = col;
                return { ...columnWithoutBoardId, boardId: col.board_id };
            });

            return cols;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de toutes les colonnes (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Récupère toutes les colonnes du tableau par son identifiant.
     *
     * @param boardId - L'identifiant du tableau.
     * @returns - Un tableau de Colonnes
     */
    async getColumnsByBoardId(boardId: string): Promise<Column[]> {
        try {
            // 1. Récupération
            const dbColumns = await this.columnDb.findByBoardId(boardId);
            if (!dbColumns) {
                throw new Error(
                    "Aucune colonne n'est enregistrée dans ce tableau."
                );
            }

            // 2. Transformation des données
            const columns = dbColumns.map((column) => {
                const formattedColumn = this.formatColumn(column);
                return formattedColumn;
            });

            return columns;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération des colonnes du tableau (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Modifie une colonne.
     *
     * @param name - Le nom de la colonne.
     * @param wip  - Le WIP (Work In Progress) de la colonne.
     * @param columnId - L'identifiant de la colonne.
     * @throws Error - Si la modification de la colonne échoue.
     * @returns formatColumn - La colonne modifiée.
     */
    async updateColumn(
        name: string,
        wip: number | null,
        columnId: string
    ): Promise<Column> {
        try {
            // 1. Récupération
            const columnToUpdate = await this.getColumnById(columnId);

            // 2. Validation du WIP toujours, validation de l'unicité du nom si celui-ci a changé
            const isNewName = columnToUpdate.name !== name;
            // Réduit le nombre de paramètres de la fonction (> à 3)
            const validateColumnInput = {
                name: name,
                wip: wip,
                boardId: columnToUpdate.boardId,
                isNewName: isNewName,
            };
            await this.validateColumn(validateColumnInput);
            await this.canSetWip(wip, columnId);

            // 3. Modification
            const updatedColumn = await this.columnDb.update(
                name,
                wip,
                columnId
            );
            if (!updatedColumn) {
                throw new Error('La modification de la colonne a échouée');
            }

            // 4. Transformation des données
            const formattedColumn = this.formatColumn(updatedColumn);

            return formattedColumn;
        } catch (error) {
            console.error(
                `Erreur lors de la mise à jour des colonnes (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Supprime une colonne par son identifiant.
     *
     * @param id - L'identifiant de la colonne à supprimer.
     * @throws Error - Si la colonne n'a pas pu être supprimée.
     * @returns isDeleted - true si la colonne est supprimée, false si elle ne l'est pas.
     */
    async deleteColumn(id: string): Promise<boolean> {
        try {
            // 1. Suppression
            const isDeleted = await this.columnDb.delete(id);
            if (!isDeleted) {
                throw new Error(
                    'Aucun colonne correspondante n’a été trouvée.'
                );
            }

            return isDeleted;
        } catch (error) {
            console.error(
                `Erreur lors de la suppression de la colonne (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Vérifie si la colonne peut prendre des tâches.
     * - Si la colonne ne contient pas de tâche.
     * - Si le wip de la colonne est null.
     * - Si le wip est supérieure au nombre de tâches affectées à la colonne.
     *
     * @param columnId - L'identifiant de la colonne à vérifier.
     * @returns - true si on peut ajouter des tâches, faux si non.
     */
    async canAddTask(columnId: string): Promise<boolean> {
        // 1. Récupération
        const dbColumn = await this.getColumnById(columnId);

        // 2. Récupération des tâches de la colonne
        const tasks = await this.taskDb.findByColumnId(columnId);

        // 3. Vérification
        const canAdd =
            !tasks || dbColumn.wip === null || dbColumn.wip > tasks.length;

        return canAdd;
    }

    /**
     * Vérifie si le WIP (Work In Progress) est valide pour une colonne donnée.
     * - Le WIP doit être nul ou supérieur au nombre de tâches actuelles dans la colonne.
     *
     *  @param wip - Le WIP à vérifier.
     *  @param columnId - L'identifiant de la colonne concernée.
     *  @throws Error - Si le WIP est inférieur au nombre de tâches existantes.
     */
    async canSetWip(wip: number | null, columnId: string) {
        const tasks = await this.taskDb.findByColumnId(columnId);

        if (wip && tasks && wip < tasks.length) {
            throw new Error(
                `Le nombre autorisé doit dépasser le nombre de tâches actuelles`
            );
        }
    }

    /**
     * Valide le WIP (Work In Progress) et le nom de la colonne.
     *
     * @param name - Le nom à vérifier.
     * @param wip - Le wip à valider.
     * @param boardId - Le tableau dans lequel chercher.
     * @param [isNewName=true] - Si vrai permet de vérifier l'unicité du nom, Si faux ne le vérifie pas.
     */
    async validateColumn({
        name,
        wip,
        boardId,
        isNewName = true,
    }: ColumnValidationInput): Promise<void> {
        this.validateWip(wip);
        if (isNewName) {
            await this.validateColumnNameIsUniqueInBoard(name, boardId);
        }
    }

    /**
     * Valide le WIP (Work In Progress).
     * La validation du wip ne se fait que s'il est défini.
     * - Si wip est null ou undefined, cela signifie qu'il n'y a pas de limites.
     * - Si Wip est défini et inférieur ou égal à 0, c'est un valeur invalide.
     *
     * @param wip - Le wip à valider.
     * @throws Error - Si le wip est défini mais invalide.
     */
    validateWip(wip: number | null): void {
        if (wip && wip <= 0) {
            throw new Error(
                'Le nombre de tâches autorisées doit être supérieure à zéro'
            );
        }
    }

    /**
     * Vérifie si le nom de la colonne est déjà utilisé dans le tableau.
     *
     * @param name - Le nom à vérifier.
     * @param boardId - Le tableau dans lequel chercher.
     * @throws Error - Si le nom existe déjà.
     */
    async validateColumnNameIsUniqueInBoard(
        name: string,
        boardId: string
    ): Promise<void> {
        const isNameExists = await this.columnDb.findByNameAndByBoardId(
            name,
            boardId
        );
        if (isNameExists) {
            throw new Error('Ce nom de colonne est déjà utilisé');
        }
    }

    /**
     * Tranforme la colonne issue de la base de données
     * en format utilisable côté application.
     *
     * @param columnDb - La colonne SQL à transfomer.
     * @returns - La colonne avec les propriété en camelCase.
     */
    formatColumn(columnDb: ColumnDbRecord): Column {
        // On change le nom de la propriété board_id -> boardId
        const { board_id, ...columnWithoutSQLNaming } = columnDb;
        return {
            ...columnWithoutSQLNaming,
            boardId: columnDb.board_id,
        };
    }
}

export default ColumnService;
