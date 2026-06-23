import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/styles.css'; // Importando o CSS global

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email.trim() || !senha.trim()) {
      setErro('E-mail e senha são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { email, senha });
      const res = await api.post('/auth/login', { email, senha });
      const { token } = res.data;
      localStorage.setItem('@SGF:token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErro(error?.response?.data?.error || 'Erro no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister} className="auth-form">
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
        <button type="submit" disabled={loading} className="btn-success">
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      {erro && <p style={{ color: 'red', marginTop: '16px' }}>{erro}</p>}
      <p style={{ marginTop: '18px' }}>
        Já tem uma conta? <Link to="/login">Voltar para o Login</Link>
      </p>
    </div>
  );
}