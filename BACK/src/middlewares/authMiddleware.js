const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Capturar o cabeçalho de autorização
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de acesso não fornecido.' });
  }

  // 2. O cabeçalho vem no formato "Bearer <TOKEN>", precisamos dividir a string
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token malformatado.' });
  }

  const token = parts[1];

  // 3. Verificar se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // 4. Injetar os dados do usuário na requisição para uso futuro nos controllers
    req.userId = decoded.sub;
    req.userEmail = decoded.email;

    return next(); // Autorizado! Segue para o Controller
  });
};

module.exports = authMiddleware;