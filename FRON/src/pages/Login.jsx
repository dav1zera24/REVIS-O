import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('@SGF:token', 'demo-token');
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login (teste)</h1>
      <p>Use o botão abaixo para simular login e acessar o dashboard.</p>
      <button onClick={handleLogin} style={{ padding: '8px 12px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px' }}>
        Entrar
      </button>
    </div>
  );
}
