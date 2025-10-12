const jwt = require("jsonwebtoken");
const User = require("../models/users");

const { JWT_SECRET = "dev-secret", JWT_EXPIRES = "7d" } = process.env;

// GET /users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((userData) => res.send({ data: userData }))
    .catch(() => res.status(500).send({ message: "Erro no servidor" }));
};

// GET /users/:userId
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((userData) => {
      if (!userData)
        return res.status(404).send({ message: "Usuário não encontrado" });
      return res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// GET /users/me
module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user)
        return res.status(404).send({ message: "Usuário não encontrado" });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// POST /signup
module.exports.createUser = (req, res) => {
  const {
    name = "Jacques Cousteau",
    about = "Explorer",
    avatar = "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "E-mail e senha são obrigatórios" });
  }

  return User.create({ name, about, avatar, email, password })
    .then((user) => {
      const publicUser = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
      });
      return res.status(201).send({ data: publicUser, token });
    })
    .catch((err) => {
      if (err.code === 11000)
        return res.status(409).send({ message: "E-mail já cadastrado" });
      if (err.name === "ValidationError")
        return res.status(400).send({ message: "Dados inválidos" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// POST /signin
module.exports.login = (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ message: "E-mail e senha são obrigatórios" });
  email = String(email).trim().toLowerCase();

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
      });
      return res.send({ token });
    })
    .catch(() =>
      res.status(401).send({ message: "E-mail ou senha incorretos" })
    );
};

// PATCH /users/me
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user)
        return res.status(404).send({ message: "Usuário não encontrado" });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).send({ message: "Dados inválidos" });
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};

// PATCH /users/me/avatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user)
        return res.status(404).send({ message: "Usuário não encontrado" });
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).send({ message: "URL de avatar inválida" });
      if (err.name === "CastError")
        return res.status(400).send({ message: "ID inválido" });
      return res.status(500).send({ message: "Erro no servidor" });
    });
};
