const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;

const ZonaSchema = new mongoose.Schema(
  {
    inep: {
      type: String,
      unique: [true, "Usuário já consta no banco"],
    },
    idescola: {
      type: String,
    },
    nome: {
      type: String,
    },
    diretor: {
      type: String,
    },
    coordenador_geral: {
      type: String,
    },
    telefone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      //  match: [/\S+@\S+\.\S+\, 'é inválido.']
    },
    endereco: {
      type: String,
    },
    status: {
      type: String,
    },
    tipo: {
      type: String,
    },
    zona: {
      type: String,
    },
    role: {
      type: Array,
      default: ["super-adm"],
    },
    acesso: {
      type: Number,
      default: 0,
    },
    hash: {
      type: String,
      default: "",
    },
    salt: {
      type: String,
      default: "",
    },
    deletado: Boolean,
    recovery: {
      type: {
        token: String,
        date: Date,
      },
      default: {},
    },
    deletado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { collection: "zona" }
);

ZonaSchema.methods.setSenha = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

ZonaSchema.methods.validarSenha = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return hash === this.hash;
};

ZonaSchema.methods.gerarToken = function () {
  const hoje = new Date();
  const exp = new Date(hoje);
  exp.setDate(hoje.getDate() + 15);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      nome: this.nome,
      exp: parseFloat(exp.getTime() / 1000, 10),
    },
    secret
  );
};

ZonaSchema.methods.enviarAuthJSON = function () {
  return {
    _id: this._id,
    nome: this.nome,
    email: this.email,
    role: this.role,
    acesso: this.acesso,
    token: this.gerarToken(),
  };
};

//RECUPERAÇÃO
ZonaSchema.methods.criarTokenRecuperacaoSenha = function () {
  this.recovery = {};
  this.recovery.token = crypto.randomBytes(16).toString("hex");
  this.recovery.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  return this.recovery;
};

ZonaSchema.methods.finalizarTokenRecuperacaoSenha = function () {
  this.recovery = { token: null, date: null };
  return this.recovery;
};

module.exports = mongoose.model("Zona", ZonaSchema);
