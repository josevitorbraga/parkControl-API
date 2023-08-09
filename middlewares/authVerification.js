import jwt from 'jsonwebtoken';

const authVerification = (req, res, next) => {
  // Obter o token do cabeçalho da solicitação
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token de autorização não fornecido.' });
  }

  // Verificar se o token é válido
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: 'Token de autorização inválido.' });
    }

    // Se o token for válido, você pode adicionar os dados decodificados ao objeto de solicitação
    req.user = decoded;

    // Chame next() para passar para a próxima função no pipeline do Express
    next();
  });
};

export default authVerification;
