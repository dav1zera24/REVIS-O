const productModel = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { nome, preco, company_id } = req.body;
    if (!nome || preco == null) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const newProduct = await productModel.create(nome, preco, company_id);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, company_id } = req.body;

    const updated = await productModel.update(id, nome, preco, company_id);
    if (!updated) return res.status(404).json({ error: 'Produto não encontrado.' });
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await productModel.remove(id);
    if (!removed) return res.status(404).json({ error: 'Produto não encontrado.' });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao deletar produto.' });
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
