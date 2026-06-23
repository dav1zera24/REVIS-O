const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes'); // Importação correta
const productRoutes = require('./routes/productRoutes');

const app = express(); // Primeiro inicializa o app!

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Vinculação das Rotas (Depois que o app já existe)
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes); 
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Gestão de Fornecimento (SGF) rodando com sucesso!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});