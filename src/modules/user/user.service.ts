import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
	const { name, email, password, age, phone, address } = payload;

	const hashedPass = await bcrypt.hash(password as string, 10);

	const result = await pool.query(
		`INSERT INTO users(name, email, password, age, phone, address) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
		[name, email, hashedPass, age, phone, address]
	);

	return result;
};

const getUsers = async () => {
	return await pool.query(`SELECT * FROM users`);
};

const getSingleUser = async (id: string) => {
	return await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

const updateUser = async (name: string, email: string, id: string) => {
	return await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [
		name,
		email,
		id,
	]);
};

const deleteUser = async (id: string) => {
	return await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
};

export const userServices = {
	createUser,
	getUsers,
	getSingleUser,
	updateUser,
	deleteUser,
};
