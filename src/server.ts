import app from "./app";
import config from "./config";

const port = config.port;

// single todo
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

// update todo
app.put("/todos/:id", async (req: Request, res: Response) => {
	const { title, completed } = req.body;
	try {
		const result = await pool.query(
			`UPDATE todos SET title=$1, completed=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
			[title, completed, req.params.id]
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

// delete todo
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
