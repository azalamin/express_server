import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
	const { user_id, title } = req.body;

	try {
		const result = await todoServices.createTodo(user_id, title);

		res.status(200).json({
			success: true,
			message: "Todo created",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const getTodos = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.getTodos();

		res.status(200).json({
			success: true,
			message: "Todos retrieved successfully!",
			data: result.rows,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			details: error,
		});
	}
};

const updateTodo = async (req: Request, res: Response) => {
	const { title, description } = req.body;
	try {
		const result = await todoServices.updateTodo(title, description, req.params.id!);

		res.status(200).json({
			success: true,
			message: "Todo updated successfully!",
			data: result.rows[0],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			details: error,
		});
	}
};

const getSingleTodo = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.getSingleTodo(req.params.id as string);

		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Successfully retrieved todo",
				data: result.rows,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			details: error,
		});
	}
};

const getSingleUserTodo = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.getSingleUserTodos(req.params.user_id!);

		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "Todos not found for this users",
			});
		} else {
			res.status(200).json({
				success: true,
				message: `${result.rows.length} todos found for this user!`,
				data: result.rows,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			details: error,
		});
	}
};

const deleteTodo = async (req: Request, res: Response) => {
	try {
		const result = await todoServices.deleteTodo(req.params.id!);

		if (result.rowCount === 0) {
			res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Todo deleted successfully!",
				data: result.rows,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			details: error,
		});
	}
};

export const todoControllers = {
	createTodo,
	getTodos,
	updateTodo,
	getSingleTodo,
	getSingleUserTodo,
	deleteTodo,
};
