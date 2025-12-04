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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
