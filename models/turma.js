const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate");

const TurmaSchema = new mongoose.Schema(
  {
    zona: {
      type: Schema.Types.ObjectId,
      ref: "Zona",
      required: true,
    },
    nomeTurma: {
      type: String,
    },
    qtdeAlunos: {
      type: String,
    },
    qtdeProf: {
      type: String,
    },
    deletado: {
      type: Boolean,
      required: [true, "não pode ficar vazio."],
      default: false,
    },
  },
  { timestamps: true },
  { collection: "votacao" }
);

TurmaSchema.plugin(mongoosePaginate);
TurmaSchema.plugin(uniqueValidator, { message: "já está sendo utilizado" });

module.exports = mongoose.model("Turma", TurmaSchema);
