import { log } from "console";
import Board from "../models/board";
import BoardDb from "../repositories/boardDb";
import { v4 as uuidv4 } from 'uuid';

class BoardService {
	private boardDb: BoardDb;

	constructor() {
		this.boardDb = new BoardDb();
	}

	async createBoard(name: string, userId: string): Promise<Board> {
		try {
			const existingBoard = await this.boardDb.findByNameAndByUserId(name, userId);
			if (existingBoard) {
				throw new Error("Ce nom de tableau existe déjà.")
			}

			const id = uuidv4()
			const board = await this.boardDb.create(id, name, userId);
			if (!board) {
				throw new Error("La création du tableau a échoué.")
			}

			return board;
		} catch (error: any) {
			console.error("Erreur lors de la création du tableau (Service):", error);
			throw error;
		}
	};

	async getBoardById(id: string): Promise<Board> {
		try {
			const board = await this.boardDb.findById(id);
			if (!board) {
				throw new Error("Le tableau n'existe pas.");
			}

			return board;
		} catch (error: any) {
			console.error("Erreur lors de la récupération du tableau (Service):", error);
			throw error;
		}
	};

	async getAllBoards(): Promise<Board[]> {
		try {
			const boards = await this.boardDb.findAll();
			if (boards.length === 0) {
				throw new Error("Aucun tableau n'est enregistré.")
			}

			return boards;
		} catch (error: any) {
			console.error("Erreur lors de la récupération de la liste de tous les tableaux (Service):", error);
			throw error;
		}
	};

	async getBoardsByUserId(userId: string): Promise<Board[]> {
		try {
			const boards = await this.boardDb.findByUserId(userId);
			if (boards.length === 0) {
				throw new Error("Aucun tableau n'est enregistré pour cet utilisateur.")
			}

			return boards;
		} catch (error) {
			console.error("Erreur lors de la récupération de la liste des tableaux de l'utilisateur (Service):", error);
			throw new Error("Impossible de récupérer la liste des tableaux de l'utilisateur.");
		}
	};

	async updateBoard(name: string, id: string): Promise<Board> {
		try {
			const updatedBoard = await this.boardDb.update(name, id);
			if (!updatedBoard) {
				throw new Error("Le tableau n'existe pas.")
			}

			return updatedBoard;
		} catch (error) {
			console.error("Erreur lors de la mise à jour du tableau (Service):", error);
			throw new Error("Impossible de mettre à jour le tableau.");
		}
	};

	async deleteBoard(id: string): Promise<boolean> {
		try {
			const userDeleted = await this.boardDb.delete(id);
			if (!userDeleted) {
				throw new Error("Le tableau n'existe pas.");
			}

			return userDeleted;
		} catch (error) {
			console.error("Erreur lors de la suppression du tableau (Service):", error);
			throw new Error("Impossible de suppression du tableau.");
		}
	};
}

export default BoardService;
