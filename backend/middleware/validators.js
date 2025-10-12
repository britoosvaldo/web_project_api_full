const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

// 🔍 Validador custom para URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  // "string.uri" é o mesmo tipo de erro do Joi padrão
  return helpers.error("string.uri");
};

// 💬 Schemas de validação
const validateSignIn = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
});

const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

module.exports = {
  validateURL,
  validateSignIn,
  validateSignUp,
  validateCreateCard,
};
