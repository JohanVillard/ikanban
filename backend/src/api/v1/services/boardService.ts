import { v4 as uuidv4 } from 'uuid';
import BoardDb from '../repositories/boardDb.js';
import { Board } from '../../../types/board.js';

class BoardService {
    private boardDb: BoardDb;

    constructor() {
        this.boardDb = new BoardDb();
    }

    async createBoard(name: string, userId: string): Promise<Board> {
        try {
            const existingBoard = await this.boardDb.findByNameAndByUserId(
                name,
                userId
            );

            if (existingBoard) {
                throw new Error('Ce nom de tableau existe déjà');
            }

            const id = uuidv4();
            const board = await this.boardDb.create(id, name, userId);
            if (!board) {
                throw new Error('La création du tableau a échoué');
            }

            const { user_id, ...boardWithoutUserid } = board;
            return {
                ...boardWithoutUserid,
                userId: board.user_id,
            };
        } catch (error) {
            console.error(
                'Erreur lors de la création du tableau (Service):',
                error
            );
            throw error;
        }
    }

    async getBoardById(id: string): Promise<Board> {
        try {
            const board = await this.boardDb.findById(id);
            if (!board) {
                throw new Error("Le tableau n'a pas été trouvé.");
            }

            const { user_id, ...boardWithoutUserid } = board;
            return {
                ...boardWithoutUserid,
                userId: board.user_id,
            };
        } catch (error) {
            console.error(
                'Erreur lors de la récupération du tableau (Service):',
                error
            );
            throw error;
        }
    }

    async getAllBoards(): Promise<Board[]> {
        try {
            const dbBoards = await this.boardDb.findAll();
            if (!dbBoards) {
                throw new Error("Aucun tableau n'est enregistré.");
            }

            const boards = dbBoards.map((board) => {
                const { user_id, ...boardWithoutUserid } = board;
                return {
                    ...boardWithoutUserid,
                    userId: user_id,
                };
            });

            return boards;
        } catch (error) {
            console.error(
                'Erreur lors de la récupération de la liste de tous les tableaux (Service):',
                error
            );
            throw error;
        }
    }

    async getBoardsByUserId(userId: string): Promise<Board[]> {
        try {
            const dbBoards = await this.boardDb.findByUserId(userId);
            if (!dbBoards) {
                throw new Error(
                    "Aucun tableau n'est enregistré pour cet utilisateur."
                );
            }

            const boards = dbBoards.map((board) => {
                const { user_id, ...boardWithoutUserid } = board;
                return {
                    ...boardWithoutUserid,
                    userId: user_id,
                };
            });

            return boards;
        } catch (error) {
            console.error(
                "Erreur lors de la récupération de la liste des tableaux de l'utilisateur (Service):",
                error
            );
            throw error;
        }
    }

    async updateBoard(name: string, id: string): Promise<Board> {
        try {
            const boardToUpdate = await this.boardDb.findById(id);
            if (!boardToUpdate) {
                throw new Error("Le tableau n'existe pas");
            }

            const foundBoard = await this.boardDb.findByNameAndByUserId(
                name,
                boardToUpdate.user_id
            );

            if (foundBoard || boardToUpdate.name === name) {
                throw new Error('Le nom du tableau est déjà pris');
            }

            const updatedBoard = await this.boardDb.update(name, id);
            if (!updatedBoard) {
                throw new Error(
                    'Impossible de modifier le tableau : les données sont identiques.'
                );
            }

            return {
                id: updatedBoard.id,
                name: updatedBoard.name,
                userId: updatedBoard.user_id,
            };
        } catch (error) {
            console.error(
                'Erreur lors de la mise à jour du tableau (Service):',
                error
            );
            throw error;
        }
    }

    async deleteBoard(id: string): Promise<boolean> {
        try {
            const isDeleted = await this.boardDb.delete(id);
            if (!isDeleted) {
                throw new Error('Aucun tableau correspondant n’a été trouvé.');
            }

            return isDeleted;
        } catch (error) {
            console.error(
                'Erreur lors de la suppression du tableau (Service):',
                error
            );
            throw error;
        }
    }
}

export default BoardService;
