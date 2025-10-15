// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const { validateSignIn, validateSignUp } = require("./middlewares/validators");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const {
  PORT = 3000,
  MONGO_URL = "mongodb://127.0.0.1:27017/aroundb",
  FRONTEND_URL = "http://localhost:5173",
  NODE_ENV = "development",
} = process.env;

const app = express();

// Segurança básica
app.use(helmet());
app.disable("x-powered-by");

// Rate limit (ajuste se necessário)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// CORS
const ALLOWED_ORIGINS = new Set([
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://around-the-usa.mooo.com",
  "https://www.around-the-usa.mooo.com",
]);

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      "https://around-the-usa.mooo.com",
      "https://www.around-the-usa.mooo.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Substitua o app.options() por isso:
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

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

// ⚠️ Logger de erros (depois das rotas)
app.use(errorLogger);

// Erros do Celebrate
app.use(errors());

// Middleware de erros centralizado
app.use(errorHandler);

// Conexão com o MongoDB e start
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`MongoDB conectado (${MONGO_URL})`);
    // Bind em 0.0.0.0 para aceitar conexões externas (PM2/nginx)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor ${NODE_ENV} ouvindo em http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Erro na conexão:", err));
