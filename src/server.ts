import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { authRoutes } from "./modules/auth/auth.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
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

// Todos CRUD
app.use("/todos", todoRoutes);

// auth routes
app.use("/auth", authRoutes);

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
