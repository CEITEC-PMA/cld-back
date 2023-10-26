const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate");

const AlunoSchema = new mongoose.Schema(
  {
    zona: {
      type: Schema.Types.ObjectId,
      ref: "Zona",
    },
    inep: {
      type: String,
    },
    nome: {
      type: String,
    },
    // dataNascimento: {
    //   type: Date,
    //   // required: [true, "não pode ficar vazio"]
    // },
    serie: {
      type: String,
    },
    turma: {
      type: String,
    },
    mae: {
      type: String,
    },
    pai: {
      type: String,
    },
    responsavel: {
      type: String,
    },
    cpf_filiacao1: {
      type: String,
    },
    cpf_filiacao2: {
      type: String,
    },
    cpf_responsavel: {
      type: String,
    },
    status_matricula: {
      type: String,
    },
    aluno_votou: {
      type: Boolean,

      default: false,
    },
    resp_votou: {
      type: Boolean,

      default: false,
    },
    votante: {
      type: Boolean,
      default: false,
    },
    deletado: {
      type: Boolean,

      default: false,
    },
  },
  { timestamps: true },
  { collection: "aluno" }
);

AlunoSchema.plugin(mongoosePaginate);
AlunoSchema.plugin(uniqueValidator, { message: "já está sendo utilizado" });

module.exports = mongoose.model("Aluno", AlunoSchema);
