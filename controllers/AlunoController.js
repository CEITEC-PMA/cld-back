const mongoose = require("mongoose");
const Aluno = mongoose.model("Aluno");
const Zona = mongoose.model("Zona");

class AlunoController {
  //ADM
  // get /admin
  async indexAdm(req, res, next) {
    try {
      const zonaInep = await Zona.findOne({ _id: req.payload.id });
      const alunos = await Aluno.find({ deletado: false, inep: zonaInep.inep })
        .collation({ locale: "en", strength: 1 })
        .sort({ serie: 1, nome: 1 });

      return res.send({ alunos });
    } catch (e) {
      next(e);
    }
  }

  async alunoZona(req, res, next) {
    try {
      const alunos = await Aluno.find({ zona: req.payload.id }).sort({
        nome: 1,
      });

      return res.send({ alunos });
    } catch (e) {
      next(e);
    }
  }

  async showSuperAdm(req, res, next) {
    try {
      const zonaInep = await Zona.findOne({ _id: req.params.id });
      const alunos = await Aluno.find({ inep: zonaInep.inep });
      return res.send({ alunos });
    } catch (e) {
      next(e);
    }
  }

  async inserirVotante(req, res, next) {
    //const zona = req.payload.id
    try {
      const alunos = await Aluno.find({ serie: /Sem/ });
      alunos.map((item) => {
        item.votante = true;
        item.save();
      });
      return res.send({ alunos });
    } catch (e) {
      next(e);
    }
  }

  async showAll(req, res, next) {
    try {
      var lista = [];
      await Zona.find({}, "_id inep").then(async (response) => {
        await Promise.all(
          response.map(async (item) => {
            const alunosTotais = await Aluno.count({ inep: item.inep });
            const alunosVotantes = await Aluno.count({
              inep: item.inep,
              votante: true,
            });
            lista.push({
              unidade: item,
              qtd_alunos_total: alunosTotais,
              qtd_alunos_votantes: alunosVotantes,
              aluno: aluno,
            });
            return lista;
          })
        );
      });
      return res.send({ lista });
    } catch (e) {
      next(e);
    }
  }

  async showAlunoAll(req, res, next) {
    try {
      const aluno = await Aluno.find({}, "inep nome turma responsavel mae pai");
      return res.send({ aluno });
    } catch (e) {
      next(e);
    }
  }

  // async showAll(req, res, next) {
  //   try {

  //     const zonas = await Zona.find()

  //     const aluno = await Aluno.find({ inep: 52021173 })
  //     aluno.map(item => {
  //       item.idescola = '614888c9d5360000e4009792'
  //       item.save()
  //     })
  //     return res.send({ aluno })
  //   } catch (e) {
  //     next(e)
  //   }
  // }

  // // get /adm/:id
  async showAdm(req, res, next) {
    try {
      const aluno = await Aluno.findOne({
        idescola: req.payload.id,
        _id: req.params.id,
      });
      return res.send({ aluno });
    } catch (e) {
      next(e);
    }
  }

  async remove(req, res, next) {
    try {
      const { ids, deletado } = req.body;
      ids.map(async (item) => {
        const aluno = await Aluno.findOne(item);
        aluno.deletado = deletado;
        await aluno.save();
      });
      return res.send({ deletado: false });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async addAluno(req, res, next) {
    try {
      const { nome, inep, responsavel1, responsavel2, responsavel3, serie } =
        req.body;
      const { id: zona } = req.user;

      const aluno = new Aluno({
        nome,
        inep,
        responsavel1,
        responsavel2,
        responsavel3,
        serie,
        zona,
      });

      await aluno
        .save()
        .then(() => res.send({ message: "Aluno adicionado" }))
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async addAlunos(req, res, next) {
    try {
      const { alunos } = req.body;
      await Promise.all(
        alunos.map(async (item) => {
          const {
            nome,
            inep,
            responsavel1,
            responsavel2,
            responsavel3,
            serie,
            votante,
            zona,
          } = item;
          const aluno = new Aluno({
            nome,
            inep,
            responsavel1,
            responsavel2,
            responsavel3,
            serie,
            votante,
            zona,
          });
          aluno.save().catch((e) => console.log(e));
        })
      );
      return res.send({ message: "alunos adicionados" });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async removeNome(req, res, next) {
    try {
      const { nomes } = req.body;
      const alunosNaoDeletados = [];
      await Promise.all(
        nomes.map(async (item) => {
          const aluno = await Aluno.findOne({ nome: item.nome }).collation({
            locale: "en",
            strength: 1,
          });
          if (aluno) {
            aluno.deletado = true;
            await aluno.save();
          } else {
            alunosNaoDeletados.push(item);
          }
        })
      );
      return res.send({ alunos: alunosNaoDeletados });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //GET /search/:search/pedidos
  async searchAlunos(req, res, next) {
    const { offset, limit } = req.query;
    const zona = req.payload.id;
    try {
      const search = new RegExp(req.params.search, "i");
      const alunos = await Aluno.paginate({
        idescola: zona,
        nome: { $regex: search },
      });
      return res.send({ alunos });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AlunoController;
