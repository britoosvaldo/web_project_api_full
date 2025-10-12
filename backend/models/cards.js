const mongoose = require("mongoose");

const avatarRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => avatarRegex.test(v),
      message: "URL do card inválida",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.path("likes").default([]); // garante o array vazio por padrão

module.exports = mongoose.model("Card", cardSchema);
