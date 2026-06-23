const pool = require('../config/db');

const findUserByEmail = async (email) => {
	const result = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
	return result.rows[0];
};

const createUser = async (email, senha) => {
	const query = 'INSERT INTO users (email, senha) VALUES ($1, $2) RETURNING *;';
	const result = await pool.query(query, [email, senha]);
	return result.rows[0];
};

module.exports = { findUserByEmail, createUser };
