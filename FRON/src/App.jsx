import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Companies from './pages/Companies'; // 1. Importa a nova tela
import PrivateRoute from './routes/PrivateRoute';

function DashboardMock() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('@SGF:token');
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>🎮 Dashboard (SGF Games)</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </div>
      <p style={{ marginTop: '20px' }}>Bem-vindo ao painel. Escolha o módulo que deseja gerenciar:</p>
      
      {/* 2. Botão de navegação adicionado */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/companies')} 
          style={{ padding: '15px 25px', fontSize: '16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          🏢 Gerenciar Empresas (Fornecedores)
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardMock /></PrivateRoute>} />
        <Route path="/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}