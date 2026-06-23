const companyModel = require('../models/companyModel');
const productModel = require('../models/productModel');

const getAllCompanies = async (req, res) => {
	try {
		const companies = await companyModel.getAll();
		return res.status(200).json(companies);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro ao buscar empresas.' });
	}
};

const createCompany = async (req, res) => {
	try {
		const { nome, cnpj, telefone } = req.body;
		if (!nome || !cnpj) {
			return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios.' });
		}

		const newCompany = await companyModel.create(nome, cnpj, telefone);
		return res.status(201).json(newCompany);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro ao criar empresa.' });
	}
};

const updateCompany = async (req, res) => {
	try {
		const { id } = req.params;
		const { nome, cnpj, telefone } = req.body;

		const updated = await companyModel.update(id, nome, cnpj, telefone);
		if (!updated) return res.status(404).json({ error: 'Empresa não encontrada.' });
		return res.status(200).json(updated);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro ao atualizar empresa.' });
	}
};

const deleteCompany = async (req, res) => {
	try {
		const { id } = req.params;
		// Verificar se existem produtos vinculados
		const count = await productModel.countByCompany(id);
		if (count > 0) {
			return res.status(400).json({ error: 'Não é possível deletar empresa com produtos vinculados.' });
		}

		const removed = await companyModel.remove(id);
		if (!removed) return res.status(404).json({ error: 'Empresa não encontrada.' });
		return res.status(204).send();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro ao deletar empresa.' });
	}
};

module.exports = { getAllCompanies, createCompany, updateCompany, deleteCompany };
