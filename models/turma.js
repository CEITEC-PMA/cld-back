const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

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

module.exports = mongoose.model("Turma", TurmaSchema);
