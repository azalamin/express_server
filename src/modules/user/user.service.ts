import { pool } from "../../config/db";

const createUser = async (
	name: string,
	email: string,
	age: number | null,
	phone: string | null,
	address: string | null
) => {
	const result = await pool.query(
		`INSERT INTO users(name, email, age, phone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`,
		[name, email, age, phone, address]
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
