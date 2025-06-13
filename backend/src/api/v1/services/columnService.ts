import { v4 as uuidv4 } from 'uuid';
import ColumnDb from '../repositories/columnDb.js';
import { Column } from '../../../types/column.js';
import TaskDb from '../repositories/taskDb.js';
import { log } from 'console';

class ColumnService {
    private columnDb: ColumnDb;
    private taskDb: TaskDb;

    constructor() {
        this.columnDb = new ColumnDb();
        this.taskDb = new TaskDb();
    }

    async createColumn(
        name: string,
        wip: number,
        boardId: string
    ): Promise<Column> {
        try {
            if (wip <= 0) {
                throw new Error(
                    'Le nombre de tâches autorisées doit être supérieure à zéro'
                );
            }

            const columnExists = await this.columnDb.findByNameAndByBoardId(
                name,
                boardId
            );
            if (columnExists) {
                throw new Error('Ce nom de colonne est déjà utilisé');
            }

            const id = uuidv4();
            const column = await this.columnDb.create(id, boardId, name, wip);
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

    async updateColumn(name: string, wip: number, id: string): Promise<Column> {
        try {
            if (wip && wip <= 0) {
                throw new Error(
                    'Le nombre de tâches autorisées doit être supérieure à zéro'
                );
            }

            const columnToUpdate = await this.columnDb.findById(id);
            if (!columnToUpdate) {
                throw new Error(
                    'Impossible de modifier la colonne : elle n’existe pas'
                );
            }

            const tasks = await this.taskDb.findByColumnId(id);
            if (wip && tasks && wip < tasks.length) {
                throw new Error(
                    `Le nombre de tâches autorisées doit être supérieure au nombre de tâches stockées dans la colonne`
                );
            }

            if (columnToUpdate.name !== name) {
                const columns = await this.columnDb.findByNameAndByBoardId(
                    name,
                    columnToUpdate.board_id
                );

                if (columns) {
                    throw new Error(
                        'Impossible de modifier la colonne : le nom est déjà pris'
                    );
                }
            }

            const formatedWip = wip ? wip : null;

            const updatedColumn = await this.columnDb.update(
                name,
                formatedWip,
                id
            );
            if (!updatedColumn) {
                throw new Error(
                    'Impossible de modifier la colonne : elle n’existe pas ou les données sont identiques'
                );
            }

            return {
                id: updatedColumn.id,
                name: updatedColumn.name,
                wip: updatedColumn.wip,
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

    async canAddTask(columnId: string): Promise<boolean> {
        try {
            const dbColumn = await this.columnDb.findById(columnId);
            if (!dbColumn) {
                throw new Error(
                    'Aucun colonne correspondante n’a été trouvée.'
                );
            }

            const tasks = await this.taskDb.findByColumnId(columnId);

            return (
                tasks === null ||
                dbColumn.wip === null ||
                dbColumn.wip > tasks.length
            );
        } catch (error) {
            throw error;
        }
    }
}

export default ColumnService;
