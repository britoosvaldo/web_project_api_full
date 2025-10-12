const jwt = require("jsonwebtoken");

const { JWT_SECRET = "dev-secret" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(403)
      .send({ message: "Acesso negado: autorização requerida" });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // 👈 exatamente como o enunciado mostra
    next();
  } catch (err) {
    return res
      .status(403)
      .send({ message: "Acesso negado: Token inválido ou Expirado" });
  }
};
