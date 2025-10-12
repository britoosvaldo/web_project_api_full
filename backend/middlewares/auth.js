const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization = "" } = req.headers;
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Autorização requerida" });
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = payload; // { _id: ... }
    return next();
  } catch (e) {
    return res.status(401).send({ message: "Token inválido" });
  }
};
