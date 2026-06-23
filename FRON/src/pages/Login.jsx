import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/styles.css'; // Importando o CSS global

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: email.trim(), senha: senha.trim() });
      const { token } = res.data;
      localStorage.setItem('@SGF:token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErro(error?.response?.data?.error || 'Falha no login: verifique credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="auth-form">
        <input 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          placeholder="Senha" 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {erro && <p style={{ color: 'red', marginTop: '16px' }}>{erro}</p>}
      <p style={{ marginTop: '18px' }}>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}