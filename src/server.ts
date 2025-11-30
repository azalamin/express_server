import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5001;
// parser
app.use(express.json());
// form data
// app.use(express.urlencoded());

// DB
const pool = new Pool({
	connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
	await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)  NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

	await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
	res.send("Hello Next Level Web Developers!");
});

// users CRUD
app.post("/users", async (req: Request, res: Response) => {
	const { name, email, age, phone, address } = req.body;

	try {
		const result = await pool.query(
			`INSERT INTO users(name, email, age, phone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`,
			[name, email, age, phone, address]
		);

		// console.log(result.rows[0]);

		res.status(201).json({
			success: true,
			message: "data inserted successfully",
			data: result.rows[0],
		});
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

app.get("/users", async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`SELECT * FROM users`);

		res.status(200).json({
			success: true,
			message: "Users retrieved successfully!",
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

// Get single todo
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
				message: "Todo fetched successfully!",
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

// Update todo
app.put("/todos/:id", async (req: Request, res: Response) => {
	const { title, description, completed, due_date } = req.body;
	try {
		const result = await pool.query(
			`UPDATE todos SET title=$1, description=$2, completed=$3, due_date=$4, updated_at=NOW() WHERE id=$5 RETURNING *`,
			[title, description, completed, due_date, req.params.id]
		);

		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				message: "Todo not found",
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Todo updated successfully!",
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

// Delete todo
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
			error: error,
		});
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
