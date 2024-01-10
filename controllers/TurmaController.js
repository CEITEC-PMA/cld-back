const mongoose = require("mongoose");
const Turma = mongoose.model("Turma");
const { v4: uuidv4 } = require("uuid");

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

  async findAllAdm(req, res, next) {
    try {
      const zona = req.payload.id;
      const turmas = await Turma.find({ deletado: false });

      const calcularSomas = (turmas) => {
        const turmasAgrupadas = {};

        turmas.forEach((turma) => {
          const { nomeTurma, qtdeAlunos, qtdeProf } = turma;

          if (!turmasAgrupadas[nomeTurma]) {
            turmasAgrupadas[nomeTurma] = {
              _id: uuidv4(),
              nomeTurma,
              qtdeAlunos: 0,
              qtdeProf: 0,
            };
          }

          turmasAgrupadas[nomeTurma].qtdeAlunos += parseInt(qtdeAlunos);
          turmasAgrupadas[nomeTurma].qtdeProf += parseInt(qtdeProf);
        });

        return Object.values(turmasAgrupadas);
      };

      const turmasAgrupadas = calcularSomas(turmas);

      res.send(turmasAgrupadas);
    } catch (error) {
      next(error);
    }
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
