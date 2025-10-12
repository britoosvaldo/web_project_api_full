const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const avatarRegex =
  /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}\/[A-Za-z0-9._~:\/?%\[\]@!$&'()*+,;=\-]*#?$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Jacques Cousteau",
    },
    about: { type: String, minlength: 2, maxlength: 30, default: "Explorer" },
    avatar: {
      type: String,
      validate: {
        validator: (v) => avatarRegex.test(v),
        message: "URL do avatar inválida",
      },
      default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "E-mail inválido",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // ✅ não retorna por padrão
    },
  },
  { timestamps: true }
);

// hash da senha
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// >>> método estático usado no login
userSchema.statics.findUserByCredentials = async function (email, password) {
  const normEmail = String(email).trim().toLowerCase();
  const user = await this.findOne({ email: normEmail }).select("+password"); // ✅
  if (!user) throw new Error("Credenciais inválidas");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Credenciais inválidas");
  return user;
};

module.exports = mongoose.model("User", userSchema);
