const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const FuncionarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "não pode ficar vazio."],
    },
    zona: {
      type: Schema.Types.ObjectId,
      ref: "Zona",
      required: true,
    },
    cargo: {
      type: String,
      required: [true, "não pode ficar vazio."],
    },
    deletado: {
      type: Boolean,
      required: [true, "não pode ficar vazio."],
      default: false,
    },
    votou: {
      type: Boolean,
      required: [true, "não pode ficar vazio."],
      default: false,
    },
  },
  { timestamps: true },
  { collection: "funcionarios" }
);

module.exports = mongoose.model("Funcionario", FuncionarioSchema);
