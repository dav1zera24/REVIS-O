const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query('SELECT * FROM companies ORDER BY nome;');
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM companies WHERE id = $1;', [id]);
  return result.rows[0];
};

const create = async (nome, cnpj, telefone) => {
  const query = 'INSERT INTO companies (nome, cnpj, telefone) VALUES ($1, $2, $3) RETURNING *;';
  const result = await pool.query(query, [nome, cnpj, telefone]);
  return result.rows[0];
};

const update = async (id, nome, cnpj, telefone) => {
  const query = 'UPDATE companies SET nome = $1, cnpj = $2, telefone = $3 WHERE id = $4 RETURNING *;';
  const result = await pool.query(query, [nome, cnpj, telefone, id]);
  return result.rows[0];
};

const remove = async (id) => {
  // Retorna true se deletou com sucesso
  const result = await pool.query('DELETE FROM companies WHERE id = $1;', [id]);
  return result.rowCount > 0;
};

module.exports = { getAll, getById, create, update, remove };