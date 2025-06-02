import { v4 as uuidv4 } from 'uuid';
import ColumnDb from '../repositories/columnDb.js';
import { Column } from '../../../types/column.js';

class ColumnService {
    private columnDb: ColumnDb;

    constructor() {
        this.columnDb = new ColumnDb();
    }

    async createColumn(name: string, boardId: string): Promise<Column> {
        try {
            const columnExists = await this.columnDb.findByNameAndByBoardId(
                name,
                boardId
            );
            if (columnExists) {
                throw new Error('Ce nom de colonne est déjà utilisé');
            }

            const id = uuidv4();
            const column = await this.columnDb.create(id, boardId, name);
            if (!column) {
                throw new Error('La création de la colonne a échouée');
            }
            const { board_id, ...columnWithoutBoardid } = column;
            return {
                ...columnWithoutBoardid,
                boardId: column.board_id,
            };
        } catch (error) {
            console.error(
                `Erreur lors de la création de la colonne (Service): ${error}`
            );
            throw error;
        }
    }

    async getColumnById(id: string): Promise<Column> {
        try {
            const column = await this.columnDb.findById(id);
            if (!column) {
                throw new Error("La colonne n'a pas été trouvée.");
            }

            const { board_id, ...columnWithoutBoardid } = column;
            return {
                ...columnWithoutBoardid,
                boardId: column.board_id,
            };
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la colonne (Service): ${error}`
            );
            throw error;
        }
    }

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

    async getColumnsByBoardId(boardId: string): Promise<Column[]> {
        try {
            const dbColumns = await this.columnDb.findByBoardId(boardId);
            if (!dbColumns) {
                throw new Error(
                    "Aucune colonne n'est enregistrée dans ce tableau."
                );
            }

            const cols = dbColumns.map((col) => {
                const { board_id, ...columnWithoutBoardId } = col;
                return { ...columnWithoutBoardId, boardId: col.board_id };
            });

            return cols;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération des colonnes du tableau (Service): ${error}`
            );
            throw error;
        }
    }

    async updateColumn(name: string, id: string): Promise<Column> {
        try {
            const columnToUpdate = await this.columnDb.findById(id);
            if (!columnToUpdate) {
                throw new Error(
                    'Impossible de modifier la colonne : elle n’existe pas'
                );
            }
            if (columnToUpdate.name === name) {
                throw new Error(
                    'Impossible de modifier la colonne : le nom est déjà pris'
                );
            }
            const updatedColumn = await this.columnDb.update(name, id);
            if (!updatedColumn) {
                throw new Error(
                    'Impossible de modifier la colonne : elle n’existe pas ou les données sont identiques'
                );
            }

            return {
                id: updatedColumn.id,
                name: updatedColumn.name,
                boardId: updatedColumn.board_id,
                position: updatedColumn.position,
            };
        } catch (error) {
            console.error(
                `Erreur lors de la mise à jour des colonnes (Service): ${error}`
            );
            throw error;
        }
    }

    async deleteColumn(id: string): Promise<boolean> {
        try {
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
}

export default ColumnService;
