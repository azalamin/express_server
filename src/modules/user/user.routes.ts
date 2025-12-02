import { Request, Response, Router } from "express";
import { pool } from "../../config/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
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

router.get("/", async (req: Request, res: Response) => {
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

export const userRoutes = router;
