const mongoose = require("mongoose");
const Turma = mongoose.model("Turma");

class TurmaController {
  async store(req, res, next) {
    const { nomeTurma, qtdeAlunos, qtdeProf, zona } = req.body;
    const turma = new Turma({
      nomeTurma,
      qtdeAlunos,
      qtdeProf,
      zona,
    });
    await turma.save();
    res.send(turma);
  }

  async findAll(req, res, next) {
    const zona = req.payload.id;
    const turmas = await Turma.find({ deletado: false, zona: zona });
    res.send(turmas);
  }

  async findOne(req, res, next) {
    const { id } = req.params;
    const turma = await Turma.findById(id);
    res.send(turma);
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { qtdeAlunos, qtdeProf } = req.body;
    await Turma.findByIdAndUpdate(
      id,
      {
        qtdeAlunos,
        qtdeProf,
      },
      { new: true }
    );
    await res.send({ message: "Turma alterada" });
  }

  async remove(req, res, next) {
    const { id } = req.params;
    const turma = await Turma.findById(id);
    if (!turma) throw new Error("Turma não encontrada");
    turma.deletado = true;
    await turma.save();
    return res.send({ deletado: true });
  }
}

module.exports = TurmaController;
