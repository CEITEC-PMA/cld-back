const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate");

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

FuncionarioSchema.plugin(mongoosePaginate);
FuncionarioSchema.plugin(uniqueValidator, {
  message: "já está sendo utilizado",
});

module.exports = mongoose.model("Funcionario", FuncionarioSchema);
