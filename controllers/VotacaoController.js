const mongoose = require("mongoose");
const moment = require("moment");
const Votacao = mongoose.model("Votacao");
const Aluno = mongoose.model("Aluno");
const Funcionario = mongoose.model("Funcionario");
const Usuario = mongoose.model("Usuario");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const EmailController = require("./EmailController");

class CandidatoController {
  /**
   *
   * ADM
   *
   */

  //GET /:id
  async showAll(req, res, next) {
    const zona = req.payload.id;
    try {
      // const votacao = await Votacao.findOne({ zona: zona }).populate({
      //   path: "voto",
      //   populate: { path: "candidato" },
      // });
      const votacao = await Votacao.aggregate([
        {
          $match: {
            zona: mongoose.Types.ObjectId(zona),
          },
        },
        {
          $lookup: {
            from: "votos",
            localField: "voto",
            foreignField: "_id",
            as: "votos",
          },
        },
        {
          $unwind: "$votos",
        },
        {
          $lookup: {
            from: "candidatos",
            localField: "votos.candidato",
            foreignField: "_id",
            as: "candidato",
          },
        },
        {
          $unwind: "$candidato",
        },
        {
          $project: {
            tipo_voto: "$votos.tipo_voto",
            numero_candidato: "$candidato.numero_candidato",
            nome_candidato: "$candidato.nome",
          },
        },
      ]);

      const alunos = await Aluno.find({ zona: zona, deletado: false });

      const funcionarios = await Funcionario.find({
        zona: zona,
        deletado: false,
      });

      const quantidadeAlunosVotantes = alunos.filter(
        (aluno) => aluno.votante === true
      ).length;

      const quantidadeAlunosNaoVotantes = alunos.filter(
        (aluno) => aluno.votante === false
      ).length;

      const quantidadeFuncionarios = funcionarios.length;

      const alunosVotaram = alunos.filter(
        (aluno) => aluno.aluno_votou === true
      ).length;

      const funcionariosVotaram = funcionarios.filter(
        (Funcionario) => Funcionario.votou === true
      ).length;

      const respAlunosVotantesVotaram = alunos.filter(
        (aluno) => aluno.votante === true && aluno.resp_votou === true
      ).length;

      const respAlunosNaoVotantesVotaram = alunos.filter(
        (aluno) => aluno.votante === false && aluno.resp_votou === true
      ).length;

      const processarVotos = (tipo) => {
        const votosTipo = votacao.filter((voto) => voto.tipo_voto === tipo);

        const votosCandidatoUm = votosTipo.filter(
          (voto) => voto.numero_candidato === 1
        );
        const candidato_um = {
          numero_votos: votosCandidatoUm.length,
          nome_candidato:
            votosCandidatoUm.length > 0
              ? votosCandidatoUm[0].nome_candidato
              : null,
        };

        const votosCandidatoDois = votosTipo.filter(
          (voto) => voto.numero_candidato === 2
        );
        const candidato_dois = {
          numero_votos: votosCandidatoDois.length,
          nome_candidato:
            votosCandidatoDois.length > 0
              ? votosCandidatoDois[0].nome_candidato
              : null,
        };

        const votosBranco = votosTipo.filter(
          (voto) => voto.numero_candidato === 3
        );
        const branco = {
          numero_votos: votosBranco.length,
          nome_candidato: "Branco",
        };

        const votosNulo = votosTipo.filter(
          (voto) => voto.numero_candidato === 4
        );
        const nulo = {
          numero_votos: votosNulo.length,
          nome_candidato: "Nulo",
        };

        return {
          candidato_um,
          candidato_dois,
          branco,
          nulo,
        };
      };

      const votosRespAlunosVotantes = processarVotos("respAlunoVotante");
      const votosRespAlunosNaoVotantes = processarVotos("respAlunoNaoVotante");
      const votosAlunos = processarVotos("aluno");
      const votosFuncionarios = processarVotos("func");

      return res.send({
        quantidadeAlunosVotantes,
        quantidadeAlunosNaoVotantes,
        quantidadeFuncionarios,
        alunosVotaram,
        funcionariosVotaram,
        respAlunosVotantesVotaram,
        respAlunosNaoVotantesVotaram,
        votos: {
          votosRespAlunosVotantes,
          votosRespAlunosNaoVotantes,
          votosAlunos,
          votosFuncionarios,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async showAdm(req, res, next) {
    try {
      const votacao = await Votacao.findOne({ zona: req.params.id }).populate({
        path: "voto",
        populate: { path: "candidato" },
      });
      return res.send({ votacao });
    } catch (e) {
      next(e);
    }
  }

  async showVotacaoFinalizada(req, res, next) {
    try {
      const votacao = await Votacao.find(
        { status: { $ne: null } },
        "resultado status"
      )
        .populate({
          path: "resultado.candidato",
          model: "Candidato",
          select: "nome foto zona cpf",
        })
        .populate({
          path: "zona",
          model: "Zona",
          select: "nome",
        });
      return res.send({ votacao });
    } catch (e) {
      next(e);
    }
  }

  async finalizarVotacao(req, res, next) {
    const votacao = await Votacao.findOne({ zona: req.params.id });

    const { candidato, porcentagem, status, confirmado } = req.body;
    try {
      votacao.confirmado = confirmado;
      votacao.resultado.candidato = candidato;
      votacao.resultado.porcentagem = porcentagem;
      votacao.status = status;
      console.log(votacao);
      votacao.markModified("resultado");
      votacao.save();
      res.send({ votacao });
    } catch (e) {
      next(e);
    }
  }

  // async showResultado(req, res, next) {
  //   try {
  //     const resultado = await Votacao.find({ confirmado: true }, 'resultado zona').populate({
  //       path: 'resultado.candidato',
  //       model: 'Candidato',
  //       select: 'nome foto cpf'
  //     }).populate({
  //       path: 'zona',
  //       model: 'Zona',
  //       select: 'nome'
  //     }
  //     )

  //     res.send({ resultado })
  //   } catch (e) {
  //     next(e)
  //   }
  // }

  //GET
  // async showAdm(req, res, next) {
  //   try {
  //     const candidato = await Candidato.findOne({ _id: req.params.id });
  //     return res.send({ candidato });
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  //DELETE /:id
  // async removeAdm(req, res, next) {
  //   try {
  //     const boletim = await Boletim.findById(req.params.id);
  //     if (!boletim) return res.status(400).send({ error: "Boletim não encontrado." })
  //     boletim.deletado = true;
  //     await boletim.save();
  //     return res.send({ deletado: true });
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  async store(req, res, next) {
    const zona = req.payload.id;

    const hora = new Date();
    const dataAtual = moment(hora).format("DD/MM/YYYY HH:mm:ss");
    const votacao = new Votacao({
      zona: zona,
      iniciada: dataAtual,
    });
    try {
      await votacao.save();
      return res.send({ votacao });
    } catch (e) {
      next(e);
    }
  }

  //PUT /images/:id
  // async updateFoto(req, res, next) {
  //   try {
  //     const candidato = await Candidato.findOne({ _id: req.params.id });
  //     if (!candidato) return res.status(400).send({ error: "Candidato não encontrado." });

  //     const novasImagens = req.files.map(item => item.filename);
  //     candidato.foto = candidato.foto.filter(item => item).concat(novasImagens);

  //     await candidato.save();

  //     return res.send({ candidato });
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  // async update(req, res, next) {
  //   const { nome, cpf, email, telefone, endereco, rg, dt_nascimento } = req.body;
  //   try {
  //     const candidato = await Candidato.findById(req.params.id)
  //     if (nome) candidato.nome = nome;
  //     if (email) candidato.email = email;
  //     if (cpf) candidato.cpf = cpf;
  //     if (telefone) candidato.telefone = telefone;
  //     if (endereco) candidato.endereco = endereco;
  //     if (rg) candidato.rg = rg;
  //     if (dt_nascimento) candidato.dt_nascimento = dt_nascimento;
  //     await candidato.save();
  //     return res.send({ candidato });
  //   } catch (e) {
  //     next(e)
  //   }
  // }
}

module.exports = CandidatoController;
