import { pool } from "../../config/db";

const createTodo = async (user_id: string, title: string) => {
	return await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [
		user_id,
		title,
	]);
};

const getTodos = async () => {
	return await pool.query(`SELECT * FROM todos`);
};

const updateTodo = async (title: string, description: string, id: string) => {
	return await pool.query(`UPDATE todos SET title=$1, description=$2 WHERE id=$3 RETURNING *`, [
		title,
		description,
		id,
	]);
};

const getSingleTodo = async (id: string) => {
	return await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
};

const getSingleUserTodos = async (user_id: string) => {
	return await pool.query(`SELECT * FROM todos WHERE user_id=$1`, [user_id]);
};

const deleteTodo = async (id: string) => {
	return await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);
};

export const todoServices = {
	createTodo,
	getTodos,
	updateTodo,
	getSingleTodo,
	getSingleUserTodos,
	deleteTodo,
};
