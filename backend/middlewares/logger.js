const path = require("path");
const winston = require("winston");
const expressWinston = require("express-winston");

const REQUEST_LOG = path.join(__dirname, "..", "request.log");
const ERROR_LOG = path.join(__dirname, "..", "error.log");

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: REQUEST_LOG })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: ERROR_LOG })],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
