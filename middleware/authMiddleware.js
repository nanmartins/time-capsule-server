// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'Access token required' });

//   try {
//     const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    // Remover "Bearer " do token antes de verificar
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    // Verificar se o token contém o `id`
    if (!decoded.id) {
      return res.status(401).json({ error: "Invalid token: user ID missing" });
    }

    // Adicionar o `id` no objeto `req.user`
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
