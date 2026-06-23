import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/styles.css'; // Importando o CSS global

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        setCompanies(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        } else {
          setErro('Erro ao carregar a lista de empresas.');
        }
      }
    };
    fetchCompanies();
  }, [refreshTrigger, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (cnpj.length !== 14) {
      setErro('O CNPJ deve conter exatamente 14 números.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/companies', { nome, cnpj, telefone });
      setNome(''); setCnpj(''); setTelefone('');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar a empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta empresa?')) {
      try {
        await api.delete(`/companies/${id}`);
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao deletar empresa.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="companies-header">
        <h2>Gerenciamento de Fornecedores / Empresas</h2>
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ marginRight: '10px' }}>Voltar para Home</button>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="btn-danger">Sair</button>
        </div>
      </div>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}

      <div className="companies-box">
        <h3>Adicionar Nova Marca/Empresa</h3>
        <form onSubmit={handleSubmit} className="companies-form">
          <input type="text" placeholder="Nome da Empresa (ex: Nintendo)" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input type="text" placeholder="CNPJ (apenas números)" value={cnpj} onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ''))} maxLength={14} required />
          <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <button type="submit" disabled={loading} className="btn-success">
            {loading ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      </div>

      <h3>Empresas Cadastradas</h3>
      {companies.length === 0 ? (
        <p>Nenhuma empresa cadastrada ainda.</p>
      ) : (
        <table className="companies-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td><strong>{company.nome}</strong></td>
                <td>{company.cnpj}</td>
                <td>{company.telefone || 'Não informado'}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => navigate(`/products?companyId=${company.id}`)} className="btn-primary">Produtos</button>
                  <button onClick={() => handleDelete(company.id)} className="btn-danger">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}