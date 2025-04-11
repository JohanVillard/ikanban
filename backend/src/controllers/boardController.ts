import { Request, Response } from "express";
import BoardService from "../services/boardService";
import { log } from "console";

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
			const { name, userId } = req.body;

			const board = await this.boardService.createBoard(name, userId);

			res.status(201).json(board);
		} catch (error: any) {
			console.error("Erreur en créant le tableau: ", error.message)

			if (error.message === "Ce nom de tableau existe déjà.") {
				res.status(409).json({ error: error.message })
			} else {
				res.sendStatus(500);
			}
		}
	};

	fetchBoardById = async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			const board = await this.boardService.getBoardById(id);
			if (!board) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(board);
		} catch (error) {
			console.error("Erreur en récupérant le tableau: ", error)
			res.sendStatus(500);
		}
	};

	fetchAllBoards = async (req: Request, res: Response): Promise<void> => {
		try {
			const boards = await this.boardService.getAllBoards();
			if (boards.length === 0) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(boards);
		} catch (error) {
			console.error("Erreur en récupérant la liste de tous les tableaux: ", error)
			res.sendStatus(500);
		}
	};

	fetchBoardsByUserId = async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			const boards = await this.boardService.getBoardsByUserId(id);
			if (boards.length === 0) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(boards);
		} catch (error) {
			console.error("Erreur en récupérant la liste des tableaux de l'utilisateur: ", error)
			res.sendStatus(500);
		}
	};

	updateBoard = async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const { name } = req.body;

			const updatedBoard = await this.boardService.updateBoard(name, id);
			if (!updatedBoard) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json(updatedBoard);
		} catch (error) {
			console.error("Erreur en mettant à jour le tableau: ", error)
			res.sendStatus(500);
		}
	};

	deleteBoard = async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			const isDeleted = await this.boardService.deleteBoard(id);
			if (!isDeleted) {
				res.sendStatus(404);
				return;
			}

			res.status(200).json({ message: "Le tableau a été supprimé avec succès." })
		} catch (error) {
			console.error("Erreur en supprimant le tableau: ", error)
			res.sendStatus(500);
		}
	};
}

export default BoardController;
