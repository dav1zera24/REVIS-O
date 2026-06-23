import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, senha });
      // Auto-login após registro
      const res = await api.post('/auth/login', { email, senha });
      const { token } = res.data;
      localStorage.setItem('@SGF:token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || 'Erro no cadastro.';
      alert(msg);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: 360 }}>
        <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button type="submit" style={{ padding: '8px 12px', background: '#198754', color: 'white', border: 'none', borderRadius: '4px' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}
