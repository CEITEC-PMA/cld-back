const mongoose = require("mongoose");

const Usuario = mongoose.model("Usuario");
const Funcionario = mongoose.model("Funcionario");
const Zona = mongoose.model("Zona");

class FuncionarioController {
  //ADM
  // get /admin
  async indexAdm(req, res, next) {
    try {
      const funcionarios = await Funcionario.find({
        deletado: false,
        zona: req.payload.id,
      })
        .collation({ locale: "en", strength: 1 })
        .sort({ nome: 1 });
      return res.send({ funcionarios });
    } catch (e) {
      next(e);
    }
  }

  async showSuperAdm(req, res, next) {
    try {
      const zonaInep = await Zona.findOne({ _id: req.params.id });
      const funcionarios = await Funcionario.find({ inep: zonaInep.inep });
      return res.send({ funcionarios });
    } catch (e) {
      next(e);
    }
  }

  async funcionarioZona(req, res, next) {
    console.log(req.payload.id);
    try {
      const funcionarios = await Funcionario.find({ zona: req.payload.id });
      return res.send({ funcionarios });
    } catch (e) {
      next(e);
    }
  }

  //GERAR NUMERO DE IDESCOLA

  // async indexAdm(req, res, next) {
  //   try {
  //     const funcionarios = await Funcionario.find({ inep: '52097145' })
  //     funcionarios.map(item => {
  //       item.idescola = '614888c9d5360000e4009767'
  //       item.save()
  //     })

  //     return res.send({ funcionarios })
  //   } catch (e) {
  //     next(e)
  //   }
  // }

  // // get /adm/:id
  async showAdm(req, res, next) {
    try {
      const funcionario = await Funcionario.findOne({
        zona: req.payload.id,
        _id: req.params.id,
      });
      return res.send({ funcionario });
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
            const funcionarioTotais = await Funcionario.count({
              inep: item.inep,
            });
            const funcionarioVotantes = await Funcionario.count({
              inep: item.inep,
            });
            lista.push({
              unidade: item,
              qtd_alunos_total: funcionarioTotais,
              qtd_alunos_votantes: funcionarioVotantes,
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

  //GET /search/:search/pedidos
  async searchAlunos(req, res, next) {
    const { offset, limit } = req.query;
    const zona = req.payload.id;
    try {
      const search = new RegExp(req.params.search, "i");
      const funcionarios = await Funcionario.paginate({
        idescola: zona,
        nome: { $regex: search },
      });

      // const funcionarios = await Funcionario.find({ idescola: zona, nome: { $regex: search } });
      return res.send({ funcionarios });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const { nome, cargo } = req.body;
    const id = req.params.id;
    const zonaId = req.payload.id;
    console.log(zonaId);
    try {
      const funcionario = await Funcionario.findByIdAndUpdate(
        id,
        {
          nome,
          cargo,
          zona: zonaId,
        },
        { new: true }
      );

      return res.send({ funcionario });
    } catch (e) {
      next(e);
    }
  }

  async addFuncionario(req, res, next) {
    try {
      const { nome, cargo } = req.body;
      const zonaId = req.payload.id;
      const funcionario = new Funcionario({
        nome,
        cargo,
        zona: zonaId,
      });

      await funcionario
        .save()
        .then(() => res.status(200).send({ message: "Funcionario adicionado" }))
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async remove(req, res, next) {
    try {
      const { ids, deletado } = req.body;
      ids.map(async (item) => {
        const funcionario = await Funcionario.findOne(item);
        funcionario.deletado = deletado;
        await funcionario.save();
      });
      return res.send({ deletado: false });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async removeByName(req, res, next) {
    try {
      const { funcionarios } = req.body;
      const funcionariosNaoDeletados = [];
      await Promise.all(
        funcionarios.map(async (func) => {
          const { nome, zona } = func;
          const funcionario = await Funcionario.findOne({ nome, zona });
          if (!funcionario) console.log(func.nome);
          if (funcionario) {
            funcionario.deletado = true;
            await funcionario.save();
          } else {
            funcionariosNaoDeletados.push(func);
          }
        })
      );
      return res.send({ funcionariosNaoDeletados });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = FuncionarioController;
