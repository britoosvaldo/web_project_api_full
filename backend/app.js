require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger"); // ⬅️ import dos loggers

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const { validateSignIn, validateSignUp } = require("./middlewares/validators");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

console.log("types:", {
  usersRouter: typeof usersRouter,
  cardsRouter: typeof cardsRouter,
});

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options(/.*/, cors()); // preflight

app.use(express.json());

// 🧾 Logger de requisições (antes das rotas)
app.use(requestLogger);

// 🔓 Rotas públicas
app.post("/signin", validateSignIn, login);
app.post("/signup", validateSignUp, createUser);

// 🔒 Tudo abaixo requer token
app.use(auth);

// Rotas protegidas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// 404
app.use((req, res) => {
  res.status(404).send({ message: "A solicitação não foi encontrada" });
});

// ⚠️ Logger de erros (antes do Celebrate)
app.use(errorLogger);

// Erros do Celebrate
app.use(errors());

// Middleware de erros centralizado
app.use(errorHandler);

// Conexão com o MongoDB
const { PORT = 3000 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/aroundb")
  .then(() => {
    console.log("Conectado ao MongoDB!");
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Erro na conexão:", err));
