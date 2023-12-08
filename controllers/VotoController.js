const mongoose = require("mongoose");
const moment = require("moment");
const Voto = mongoose.model("Voto");
const Aluno = mongoose.model("Aluno");
const Funcionario = mongoose.model("Funcionario");
const Candidato = mongoose.model("Candidato");
const Zona = mongoose.model("Zona");
const Votacao = mongoose.model("Votacao");
const { badRequest } = require("../helpers/http-helper");

class VotoController {
  async store(req, res, next) {
    const horaInicial = new Date("2023-12-08T07:15:00").getTime();

    const horaFinal = new Date("2023-12-08T20:00:00").getTime();

    const horaAtual = new Date().getTime();

    if (horaAtual > horaInicial && horaAtual < horaFinal) {
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
    } else {
      res.status(422).json({ errors: "Votação Finalizada" });
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

      const quantidadeAlunosVotantes = alunos.filter(
        (aluno) => aluno.votante
      ).length;
      const quantidadeAlunosNaoVotantes = alunos.filter(
        (aluno) => !aluno.votante
      ).length;

      const quantRespAlunosVotantes = alunos.filter(
        (aluno) => aluno.votante
      ).length;

      const quantRespAlunosNaoVotantes = alunos.filter(
        (aluno) => !aluno.votante
      ).length;

      const quantAlunosResp =
        quantidadeAlunosVotantes +
        quantidadeAlunosNaoVotantes +
        quantRespAlunosVotantes +
        quantRespAlunosNaoVotantes;

      const candidatosUnicos = [
        ...new Set(votos.map((item) => item.candidato._id)),
      ];

      const resposta = candidatosUnicos.map((candidatoId) => {
        const votoCandidato = votos.find(
          (voto) => voto.candidato._id === candidatoId
        );

        const quantVotosAlunos = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId && voto.tipo_voto === "aluno"
        ).length;

        const quantVotosFuncionarios = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId && voto.tipo_voto === "func"
        ).length;

        const quantVotosRespAlunosNaoVotantes = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId &&
            voto.tipo_voto === "respAlunoNaoVotante"
        ).length;
        const quantVotosRespAlunosVotantes = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId &&
            voto.tipo_voto === "respAlunoVotante"
        ).length;

        const totalVotosAlunosResponsaveis =
          quantVotosAlunos +
          quantVotosRespAlunosNaoVotantes +
          quantVotosRespAlunosVotantes;

        const totalVotosAlunosResponsaveisFuncionarios =
          totalVotosAlunosResponsaveis + quantVotosFuncionarios;

        const percentualAlunosResp =
          (totalVotosAlunosResponsaveis * 50) / quantAlunosResp;

        const percentualFuncionarios =
          (quantVotosFuncionarios * 50) / funcionarios.length;

        return {
          nome: votoCandidato.candidato.nome,
          foto: votoCandidato.candidato.foto[0],
          cpf: votoCandidato.candidato.cpf,
          quantidadeAlunosVotantes,
          quantRespAlunosVotantes,
          quantRespAlunosNaoVotantes,
          quantFuncionarios: funcionarios.length,
          votosAlunos: quantVotosAlunos,
          votosResponsaveisVotantes: quantVotosRespAlunosVotantes,
          votosResponsaveisNaoVotantes: quantVotosRespAlunosNaoVotantes,
          totalVotosAlunosResponsaveis,
          votosFuncionarios: quantVotosFuncionarios,
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

  async getDadosQuorumAdm(req, res, next) {
    const zona = req.payload.id;

    try {
      const zonaId = await Zona.findOne({ _id: req.params.id });

      const votos = await Voto.find({ zona: zonaId }).populate("candidato");

      const funcionarios = await Funcionario.find({ zona: zonaId });

      const alunos = await Aluno.find({ zona: zonaId });

      const quantidadeAlunosVotantes = alunos.filter(
        (aluno) => aluno.votante
      ).length;
      const quantidadeAlunosNaoVotantes = alunos.filter(
        (aluno) => !aluno.votante
      ).length;

      const quantRespAlunosVotantes = alunos.filter(
        (aluno) => aluno.votante
      ).length;

      const quantRespAlunosNaoVotantes = alunos.filter(
        (aluno) => !aluno.votante
      ).length;

      const quantAlunosResp =
        quantidadeAlunosVotantes +
        quantidadeAlunosNaoVotantes +
        quantRespAlunosVotantes +
        quantRespAlunosNaoVotantes;

      const candidatosUnicos = [
        ...new Set(votos.map((item) => item.candidato._id)),
      ];

      const resposta = candidatosUnicos.map((candidatoId) => {
        const votoCandidato = votos.find(
          (voto) => voto.candidato._id === candidatoId
        );

        const quantVotosAlunos = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId && voto.tipo_voto === "aluno"
        ).length;

        const quantVotosFuncionarios = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId && voto.tipo_voto === "func"
        ).length;

        const quantVotosRespAlunosNaoVotantes = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId &&
            voto.tipo_voto === "respAlunoNaoVotante"
        ).length;
        const quantVotosRespAlunosVotantes = votos.filter(
          (voto) =>
            voto.candidato._id === candidatoId &&
            voto.tipo_voto === "respAlunoVotante"
        ).length;

        const totalVotosAlunosResponsaveis =
          quantVotosAlunos +
          quantVotosRespAlunosNaoVotantes +
          quantVotosRespAlunosVotantes;

        const totalVotosAlunosResponsaveisFuncionarios =
          totalVotosAlunosResponsaveis + quantVotosFuncionarios;

        const percentualAlunosResp =
          (totalVotosAlunosResponsaveis * 50) / quantAlunosResp;

        const percentualFuncionarios =
          (quantVotosFuncionarios * 50) / funcionarios.length;

        return {
          nome: votoCandidato.candidato.nome,
          foto: votoCandidato.candidato.foto[0],
          cpf: votoCandidato.candidato.cpf,
          quantidadeAlunosVotantes,
          quantRespAlunosVotantes,
          quantRespAlunosNaoVotantes,
          quantFuncionarios: funcionarios.length,
          votosAlunos: quantVotosAlunos,
          votosResponsaveisVotantes: quantVotosRespAlunosVotantes,
          votosResponsaveisNaoVotantes: quantVotosRespAlunosNaoVotantes,
          totalVotosAlunosResponsaveis,
          votosFuncionarios: quantVotosFuncionarios,
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
