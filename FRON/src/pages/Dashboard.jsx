import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // Importando o CSS global unificado

export default function Dashboard() {
  const navigate = useNavigate();

  // Função para limpar o token e deslogar o usuário
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="page-container">
      {/* Cabeçalho da Home */}
      <div className="companies-header">
        <h2>Painel Principal (SGF)</h2>
        <div>
          <button onClick={handleLogout} className="btn-danger">
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo de Boas-vindas */}
      <div className="companies-box" style={{ maxWidth: '600px' }}>
        <h3>Bem-vindo ao Sistema de Gerenciamento de Fornecedores!</h3>
        <p>
          Utilize os cartões abaixo para navegar pelas funcionalidades do sistema de forma rápida e prática.
        </p>
      </div>

      {/* Grid de Menus/Ações */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        {/* Card: Gerenciamento de Empresas */}
        <div className="companies-box" style={{ flex: '1', minWidth: '250px', maxWidth: '300px', marginBottom: 0 }}>
          <h3>Empresas</h3>
          <p>Cadastre marcas, visualize CNPJs cadastrados e gerencie seus fornecedores ativos.</p>
          <button 
            onClick={() => navigate('/companies')} 
            className="btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Acessar Empresas
          </button>
        </div>

        {/* Card: Módulo de Produtos */}
        <div className="companies-box" style={{ flex: '1', minWidth: '250px', maxWidth: '300px', marginBottom: 0 }}>
          <h3>Produtos</h3>
          <p>Gerencie produtos vinculados a cada empresa cadastrada.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Acessar Produtos
          </button>
        </div>

      </div>
    </div>
  );
}