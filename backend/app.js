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

app.use(helmet());
app.disable("x-powered-by");

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const ALLOWED = new Set([
  FRONTEND_URL,
  "https://around-the-usa.mooo.com",
  "https://www.around-the-usa.mooo.com",
]);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED.has(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.method !== "OPTIONS") return next();

  const origin = req.headers.origin;
  if (!origin || ALLOWED.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.sendStatus(204);
  }
  return res.sendStatus(403);
});

app.use(express.json());
app.use(requestLogger);

app.post("/signin", validateSignIn, login);
app.post("/signup", validateSignUp, createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: "A solicitação não foi encontrada" });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`MongoDB conectado (${MONGO_URL})`);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor ${NODE_ENV} ouvindo em http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Erro na conexão:", err));
