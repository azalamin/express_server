import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

const app = express();
const port = config.port;
// parser
app.use(express.json());
// form data
// app.use(express.urlencoded());

// initializing DB
initDB();

app.get("/", logger, (req: Request, res: Response) => {
	res.send("Hello Next Level Web Developers!");
});

// users CRUD
app.use("/users", userRoutes);

// single user
app.get("/users/:id", async (req: Request, res: Response) => {
	// console.log(req.params.id);

	try {
		const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);

		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "User fetched successfully!",
				data: result.rows[0],
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			details: error,
		});
	}
});

// update user
app.put("/users/:id", async (req: Request, res: Response) => {
	const { name, email } = req.body;
	try {
		const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [
			name,
			email,
			req.params.id,
		]);

		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "User updated successfully!",
				data: result.rows[0],
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			error: error,
		});
	}
});

// delete user
app.delete("/users/:id", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
		if (result.rowCount === 0) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "User deleted successfully!",
				data: result.rows,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			error: error,
		});
	}
});

// Todos CRUD
app.post("/todos", async (req: Request, res: Response) => {
	const { user_id, title } = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
			[user_id, title]
		);

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
});

// Get TODOS
app.get("/todos", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`SELECT * FROM todos`);

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
});

app.put("/todos/:id", async (req: Request, res: Response) => {
	const { title, description } = req.body;
	try {
		const result = await pool.query(
			`UPDATE todos SET title=$1, description=$2 WHERE id=$3 RETURNING *`,
			[title, description, req.params.id]
		);

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
});

// get single todo
app.get("/todos/:id", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [req.params.id]);
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
});

// get single user's todos
app.get("/todos/user/:user_id", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`SELECT * FROM todos WHERE user_id=$1`, [req.params.user_id]);

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
});

// delete todos
app.delete("/todos/:id", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [req.params.id]);

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
});

// 404 not found routes
app.use((req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
		path: req.path,
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
