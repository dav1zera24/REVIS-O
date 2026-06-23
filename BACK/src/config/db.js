const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Executa uma query simples apenas para testar se o banco respondeu na inicialização
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro de conexão com o PostgreSQL:', err.stack);
  } else {
    console.log('✅ PostgreSQL conectado com sucesso às:', res.rows[0].now);
  }
});

module.exports = pool;