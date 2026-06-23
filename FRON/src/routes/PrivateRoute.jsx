import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  // Busca o token salvo no localStorage do navegador
  const token = localStorage.getItem('@SGF:token');

  // Se não existir token, joga o usuário de volta para a tela de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se o token existir, permite o acesso aos componentes filhos (as páginas protegidas)
  return children;
}