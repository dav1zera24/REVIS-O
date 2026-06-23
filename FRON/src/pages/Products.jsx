import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/styles.css';

export default function Products() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [products, setProducts] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const companyIdFromQuery = params.get('companyId');

    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);

        if (companyIdFromQuery) {
          setSelectedCompanyId(companyIdFromQuery);
        } else if (!selectedCompanyId && response.data.length > 0) {
          setSelectedCompanyId(response.data[0].id);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        } else {
          setErro('Erro ao carregar as empresas.');
        }
      }
    };
    fetchCompanies();
  }, [location.search, navigate, selectedCompanyId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCompanyId) {
        setProducts([]);
        return;
      }

      try {
        const response = await api.get(`/products?companyId=${selectedCompanyId}`);
        setProducts(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        } else {
          setErro('Erro ao carregar os produtos.');
        }
      }
    };
    fetchProducts();
  }, [selectedCompanyId, refreshTrigger, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!selectedCompanyId) {
      setErro('Selecione uma empresa antes de cadastrar um produto.');
      return;
    }

    if (!nome || preco.trim() === '' || quantidadeEstoque.trim() === '') {
      setErro('Nome, preço e quantidade de estoque são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/products', {
        nome,
        preco: Number(preco),
        quantidade_estoque: Number(quantidadeEstoque),
        company_id: selectedCompanyId,
      });

      setNome('');
      setPreco('');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar o produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao deletar produto.');
    }
  };

  return (
    <div className="page-container">
      <div className="companies-header">
        <h2>Produtos por Empresa</h2>
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginRight: '10px' }}>
            Voltar para Home
          </button>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="btn-danger">
            Sair
          </button>
        </div>
      </div>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}

      <div className="companies-box">
        <h3>Selecione a Empresa</h3>
        <select
          value={selectedCompanyId}
          onChange={(e) => {
            const companyId = e.target.value;
            setSelectedCompanyId(companyId);
            navigate(`/products?companyId=${companyId}`);
          }}
          style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', marginBottom: '20px' }}
        >
          <option value="" disabled>Selecione uma empresa</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.nome}</option>
          ))}
        </select>

        <h3>Adicionar Produto</h3>
        <form onSubmit={handleSubmit} className="companies-form">
          <input type="text" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input type="number" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} min="0" step="0.01" required />
          <input type="number" placeholder="Quantidade em Estoque" value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(e.target.value)} min="0" step="1" required />
          <button type="submit" disabled={loading} className="btn-success">
            {loading ? 'Salvando...' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>

      <h3>Produtos da Empresa</h3>
      {products.length === 0 ? (
        <p>Nenhum produto cadastrado para esta empresa.</p>
      ) : (
        <table className="companies-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Fornecedor</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td><strong>{product.nome}</strong></td>
                <td>{product.fornecedor_nome || (companies.find(c => String(c.id) === String(product.empresa_id))?.nome) || '-'}</td>
                <td>{(() => {
                  const price = Number(product.preco);
                  if (!Number.isFinite(price)) return product.preco !== undefined ? String(product.preco) : '-';
                  return price.toFixed(2).replace('.', ',');
                })()}</td>
                <td>
                  <button onClick={() => handleDelete(product.id)} className="btn-danger">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
