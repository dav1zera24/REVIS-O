const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY nome;');
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
  return result.rows[0];
};

const create = async (nome, preco, company_id) => {
  const query = 'INSERT INTO products (nome, preco, company_id) VALUES ($1, $2, $3) RETURNING *;';
  const result = await pool.query(query, [nome, preco, company_id]);
  return result.rows[0];
};

const update = async (id, nome, preco, company_id) => {
  const query = 'UPDATE products SET nome = $1, preco = $2, company_id = $3 WHERE id = $4 RETURNING *;';
  const result = await pool.query(query, [nome, preco, company_id, id]);
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1;', [id]);
  return result.rowCount > 0;
};

module.exports = { getAll, getById, create, update, remove };
