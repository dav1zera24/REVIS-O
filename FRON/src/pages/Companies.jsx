import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // 1. Buscar empresas cadastradas assim que a tela abre
  const loadCompanies = useCallback(async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        // Se o token falhar ou expirar, manda de volta pro login
        localStorage.clear();
        navigate('/login');
      } else {
        setErro('Erro ao carregar a lista de empresas.');
      }
    }
  }, [navigate]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);   

  // 2. Enviar o formulário de cadastro de nova empresa
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await api.post('/companies', { nome, cnpj, telefone });
      // Limpa os campos após salvar
      setNome('');
      setCnpj('');
      setTelefone('');
      // Atualiza a tabela na hora
      loadCompanies();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar a empresa.');
    }
  };

  // 3. Deletar uma empresa
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta empresa?')) {
      try {
        await api.delete(`/companies/${id}`);
        loadCompanies();
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao deletar empresa.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Cabeçalho de Navegação Simples */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>🏢 Gerenciamento de Fornecedores / Empresas</h2>
        <div>
          <button onClick={() => navigate('/dashboard')} style={{ marginRight: '10px', padding: '8px 12px', cursor: 'pointer' }}>Voltar para Home</button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {erro}</p>}

      {/* Formulário de Cadastro */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', marginBottom: '30px' }}>
        <h3>Adicionar Nova Marca/Empresa</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Nome da Empresa (ex: Nintendo)" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ padding: '8px', minWidth: '200px' }} />
          <input type="text" placeholder="CNPJ (apenas números)" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required style={{ padding: '8px' }} />
          <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cadastrar</button>
        </form>
      </div>

      {/* Tabela de Exibição */}
      <h3>Empresas Cadastradas</h3>
      {companies.length === 0 ? (
        <p>Nenhuma empresa cadastrada ainda.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#eee' }}>
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
                <td>
                  <button onClick={() => handleDelete(company.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}