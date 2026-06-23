const pool = require('../config/db');

let fkColumnCache = null;

const getForeignKeyColumn = async () => {
  if (fkColumnCache) return fkColumnCache;

  const result = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'products' AND column_name IN ('company_id', 'empresa_id');`
  );

  const columns = result.rows.map((row) => row.column_name);
  if (columns.includes('company_id')) {
    fkColumnCache = 'company_id';
    return fkColumnCache;
  }
  if (columns.includes('empresa_id')) {
    fkColumnCache = 'empresa_id';
    return fkColumnCache;
  }

  throw new Error('Nenhuma coluna de chave estrangeira encontrada em products');
};

const getAll = async (companyId) => {
  const fkColumn = await getForeignKeyColumn();
  const idExpression = `p.${fkColumn}`;
  const resultColumn = `p.${fkColumn} AS empresa_id`;
  const base = `SELECT p.*, ${resultColumn}, c.nome AS fornecedor_nome FROM products p LEFT JOIN companies c ON c.id = ${idExpression}`;

  const query = companyId != null ? `${base} WHERE ${idExpression} = $1 ORDER BY p.nome;` : `${base} ORDER BY p.nome;`;
  const params = companyId != null ? [companyId] : [];
  const result = await pool.query(query, params);
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
  return result.rows[0];
};

const create = async (nome, preco, company_id, quantidade_estoque) => {
  const fkColumn = await getForeignKeyColumn();
  const query = `INSERT INTO products (nome, preco, quantidade_estoque, ${fkColumn}) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const result = await pool.query(query, [nome, preco, quantidade_estoque, company_id]);
  return result.rows[0];
};

const update = async (id, nome, preco, company_id, quantidade_estoque) => {
  const fkColumn = await getForeignKeyColumn();
  const query = `UPDATE products SET nome = $1, preco = $2, quantidade_estoque = $3, ${fkColumn} = $4 WHERE id = $5 RETURNING *;`;
  const result = await pool.query(query, [nome, preco, quantidade_estoque, company_id, id]);
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1;', [id]);
  return result.rowCount > 0;
};

const countByCompany = async (companyId) => {
  const fkColumn = await getForeignKeyColumn();
  const query = `SELECT COUNT(*)::int AS cnt FROM products WHERE ${fkColumn} = $1;`;
  const result = await pool.query(query, [companyId]);
  return result.rows[0]?.cnt || 0;
};

module.exports = { getAll, getById, create, update, remove, countByCompany };
