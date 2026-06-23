const productModel = require('../models/productModel');
const companyModel = require('../models/companyModel');

const getAllProducts = async (req, res) => {
  try {
    let companyId = req.query.companyId ?? req.query.empresaId;
    if (companyId !== undefined) {
      companyId = parseInt(companyId, 10);
      if (Number.isNaN(companyId)) companyId = undefined;
    }
    const products = await productModel.getAll(companyId);
    console.log('getAllProducts - sample keys:', products.length ? Object.keys(products[0]) : []);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Erro em getAllProducts:', error);
    return res.status(500).json({ error: 'Erro ao buscar produtos.', details: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log('createProduct body', req.body);
    const { nome, preco, company_id, empresa_id, quantidade_estoque } = req.body;
    const companyId = company_id ?? empresa_id;

    if (!nome || preco == null || quantidade_estoque == null) {
      return res.status(400).json({ error: 'Nome, preço e quantidade de estoque são obrigatórios.' });
    }

    if (!companyId) {
      return res.status(400).json({ error: 'company_id ou empresa_id é obrigatório.' });
    }

    const company = await companyModel.getById(companyId);
    if (!company) {
      return res.status(400).json({ error: 'Empresa informada não existe.' });
    }

    const newProduct = await productModel.create(nome, preco, companyId, quantidade_estoque);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro em createProduct:', error.stack || error);
    return res.status(500).json({ error: 'Erro ao criar produto.', details: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, company_id, empresa_id, quantidade_estoque } = req.body;
    const companyId = company_id ?? empresa_id;

    if (companyId) {
      const company = await companyModel.getById(companyId);
      if (!company) {
        return res.status(400).json({ error: 'Empresa informada não existe.' });
      }
    }

    const updated = await productModel.update(id, nome, preco, companyId, quantidade_estoque);
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
