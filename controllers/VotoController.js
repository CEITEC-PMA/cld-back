const mongoose = require("mongoose");
const moment = require("moment");
const Voto = mongoose.model("Voto");
const Aluno = mongoose.model("Aluno");
const Funcionario = mongoose.model("Funcionario");
const Candidato = mongoose.model("Candidato");
const Votacao = mongoose.model("Votacao");
const { badRequest } = require("../helpers/http-helper");

class VotoController {
  async store(req, res, next) {
    const zona = req.payload.id;
    const { candidato, idVotante, tipoVoto } = req.body;
    const votacao = await Votacao.findOne({ zona: zona });

    const hora = new Date();
    const dataAtual = moment(hora).format("DD/MM/YYYY HH:mm:ss");

    if (!votacao) {
      const votacaoIniciada = new Votacao({
        zona: zona,
        iniciada: dataAtual,
      });
      votacaoIniciada.save();
      votacao = votacaoIniciada;
    }

    try {
      if (
        tipoVoto === "aluno" ||
        tipoVoto === "respAlunoVotante" ||
        tipoVoto === "respAlunoNaoVotante"
      ) {
        const aluno = await Aluno.findOne({ _id: idVotante });
        if (tipoVoto === "aluno" && aluno.aluno_votou === true)
          throw badRequest("Aluno já votou!");
        if (
          (tipoVoto === "respAlunoVotante" ||
            tipoVoto === "respAlunoNaoVotante") &&
          aluno.resp_votou === true
        )
          throw badRequest("Responsável já votou!");
        if (tipoVoto === "aluno") aluno.aluno_votou = true;
        if (
          tipoVoto === "respAlunoVotante" ||
          tipoVoto === "respAlunoNaoVotante"
        )
          aluno.resp_votou = true;
        await aluno.save();
      }

      if (tipoVoto === "func") {
        const funcionario = await Funcionario.findOne({ _id: idVotante });
        if (funcionario.votou === true)
          throw badRequest("Funcionário já votou!");
        funcionario.votou = true;
        await funcionario.save();
      }

      const voto = new Voto({
        zona: zona,
        data_hora_voto: dataAtual,
        tipo_voto: tipoVoto,
        candidato: candidato,
        tipo_voto: tipoVoto,
      });
      votacao.voto.push(voto._id);
      await voto.save();

      await votacao.save();
      return res.send({ voto });
    } catch (e) {
      next(e);
    }
  }

  async storeAdm(req, res, next) {
    const { candidato, idVotante, tipoVoto } = req.body;
    const votacao = await Votacao.findOne({ zona: req.params.id });

    const hora = new Date();
    const dataAtual = moment(hora).format("DD/MM/YYYY HH:mm:ss");

    if (!votacao) {
      const votacaoIniciada = new Votacao({
        zona: req.params.id,
        iniciada: dataAtual,
      });
      votacaoIniciada.save();
      votacao = votacaoIniciada;
    }

    try {
      if (
        tipoVoto === "aluno" ||
        tipoVoto === "respAlunoVotante" ||
        tipoVoto === "respAlunoNaoVotante"
      ) {
        const aluno = await Aluno.findOne({ _id: idVotante });
        if (tipoVoto === "aluno" && aluno.aluno_votou === true)
          throw badRequest("Aluno já votou!");
        if (
          (tipoVoto === "respAlunoVotante" ||
            tipoVoto === "respAlunoNaoVotante") &&
          aluno.resp_votou === true
        )
          throw badRequest("Responsável já votou!");
        if (tipoVoto === "aluno") aluno.aluno_votou = true;
        if (
          tipoVoto === "respAlunoVotante" ||
          tipoVoto === "respAlunoNaoVotante"
        )
          aluno.resp_votou = true;
        await aluno.save();
      }

      if (tipoVoto === "func") {
        const funcionario = await Funcionario.findOne({ _id: idVotante });
        if (funcionario.votou === true)
          throw badRequest("Funcionário já votou!");
        funcionario.votou = true;
        await funcionario.save();
      }

      const voto = new Voto({
        zona: req.params.id,
        data_hora_voto: dataAtual,
        tipo_voto: tipoVoto,
        candidato: candidato,
        tipo_voto: tipoVoto,
      });
      votacao.voto.push(voto._id);
      await voto.save();

      await votacao.save();
      return res.send({ voto });
    } catch (e) {
      next(e);
    }
  }

  //ADD ALEATORIAMENTE VOTOS

  // async store(req, res, next) {
  //   const zona = req.payload.id;
  //   const votacao = await Votacao.findOne({ zona: zona })

  //   const hora = new Date
  //   const dataAtual = moment(hora).format('DD/MM/YYYY HH:mm:ss')

  //   if (!votacao) {
  //     const votacaoIniciada = new Votacao({
  //       zona: zona,
  //       iniciada: dataAtual,
  //     })
  //     votacaoIniciada.save()
  //     votacao = votacaoIniciada
  //   }

  //   try {

  //     const candidato = await Candidato.find({ zona }, '_id')
  //     const idCandidato = candidato[Math.floor((Math.random() * candidato.length))]
  //     for (var i = 0; i < 100; i++) {
  //       const aluno = await Aluno.findOne({ inep: '52097145', resp_votou: false })
  //       const voto = new Voto({
  //         zona: zona,
  //         data_hora_voto: dataAtual,
  //         tipo_voto: 'resp',
  //         candidato: idCandidato._id
  //       })
  //       aluno.resp_votou = true
  //       await aluno.save();
  //       votacao.voto.push(voto._id)
  //       await voto.save();
  //       await votacao.save();
  //     }
  //     return res.send({ aluno })
  //   } catch (e) {
  //     next(e)
  //   }
  // }

  async showAll(req, res, next) {
    try {
      const votos = await Voto.find({}, "_id zona tipo_voto candidato");
      res.send({ votos });
    } catch (e) {
      next(e);
    }
  }
  async getDadosQuorum(req, res, next) {
    const zona = req.payload.id;
    try {
      const votos = await Voto.find({ zona }).populate("candidato");

      const funcionarios = await Funcionario.find({ zona });

      const alunos = await Aluno.find({ zona });

      const quantidadeAlunosVotantes = alunos.filter((aluno) => aluno.votante);
      const quantidadeAlunosNaoVotantes = alunos.filter(
        (aluno) => !aluno.votante
      );

      console.log(funcionarios.length);
      console.log(quantidadeAlunosVotantes.length);
      console.log(quantidadeAlunosNaoVotantes.length);

      const candidatosUnicos = [
        ...new Set(votos.map((item) => item.candidato._id)),
      ];

      const resposta = candidatosUnicos.map((candidatoId) => {
        const votoCandidato = votos.find(
          (voto) => voto.candidato._id === candidatoId
        );

        const votosAlunos = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId && voto.tipo_voto === "aluno"
        );

        const votosFuncionarios = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId && voto.tipo_voto === "func"
        );

        const votosRespAlunosNaoVotantes = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId &&
            voto.tipo_voto === "respAlunoNaoVotante"
        );
        const votosRespAlunosVotantes = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId &&
            voto.tipo_voto === "respAlunoVotante"
        );

        const totalVotosAlunosResponsaveis =
          votosAlunos.length +
          votosRespAlunosVotantes.length +
          votosRespAlunosNaoVotantes.length;

        const totalVotosAlunosResponsaveisFuncionarios =
          totalVotosAlunosResponsaveis + votosFuncionarios.length;

        const percentualAlunosResp =
          ((votosAlunos.length +
            votosRespAlunosVotantes.length +
            votosRespAlunosNaoVotantes.length) *
            50) /
            (quantidadeAlunosVotantes.length * 2) +
          quantidadeAlunosNaoVotantes.length * 2;

        const percentualFuncionarios =
          (votosFuncionarios.length * 50) / funcionarios.length;
        return {
          nome: votoCandidato.candidato.nome,
          votosAlunos: votosAlunos.length,
          votosResponsaveisVotantes: votosRespAlunosVotantes.length,
          votosResponsaveisNaoVotantes: votosRespAlunosNaoVotantes.length,
          totalVotosAlunosResponsaveis,
          votosFuncionarios: votosFuncionarios.length,
          totalVotosAlunosResponsaveisFuncionarios,
          percentualAlunosResp,
          percentualFuncionarios,
          percentualTotal: percentualAlunosResp + percentualFuncionarios,
        };
      });
      res.send({ resposta });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = VotoController;
