const mongoose = require("mongoose");
const Candidato = mongoose.model("Candidato");
const moment = require("moment");
const imageFileHelper = require("../helpers/upload-image-helper");
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

  async search(req, res, next) {
    const zona = req.payload.id;
    const search = new RegExp(req.params.search, "i");
    try {
      const candidato = await Candidato.findOne({
        numero_candidato: req.params.numero_candidato,
        zona: zona,
        deletado: false,
      });
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  async inserirNumero(req, res, next) {
    try {
      const candidato = await Candidato.find();
      candidato.map(async (item) => {
        item.numero_candidato = 1;
        await item.save();
      });
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  async inserirCandidatoBrancoNulo(req, res, next) {
    try {
      const candidato = new Candidato({
        cpf: dadosCandidato.cpf,
        nome: "Branco",
        email: dadosCandidato.email,
        telefone: dadosCandidato.telefone,
        // dt_nascimento: dadosCandidato.dt_nascimento,
        // rg: dadosCandidato.rg,
        // endereco: dadosCandidato.endereco,
        cargo: dadosCandidato.cargo,
        funcao: dadosCandidato.funcao,
        matricula: dadosCandidato.matricula,
        // graduacao: dadosCandidato.graduacao,
        //curso_graduacao: dadosCandidato.curso_graduacao,
        //pos_graduacao: dadosCandidato.pos_graduacao,
        //curso_pos_graduacao: dadosCandidato.curso_pos_graduacao,
        // mestrado: dadosCandidato.mestrado,
        // curso_mestrado: dadosCandidato.curso_mestrado,
        // doutorado: dadosCandidato.doutorado,
        // curso_doutorado: dadosCandidato.curso_doutorado,
        curso_gestor: dadosCandidato.curso_gestor,
        obs_curso_gestor: dadosCandidato.obs_curso_gestor,
        //outros_cursos: dadosCandidato.outros_cursos,
        data_entrada_inst: dadosCandidato.data_entrada_inst,
        data_entrada_docencia: dadosCandidato.data_entrada_docencia,
        tempo_modulacao: calculaTempo(
          moment(dadosCandidato.data_entrada_inst).format("DD/MM/YYYY")
        ),
        tempo_docencia: calculaTempo(
          moment(dadosCandidato.data_entrada_docencia).format("DD/MM/YYYY")
        ),
        numero_candidato: dadosCandidato.numero_candidato,
        protocolo: `EDU${numRandom}2021`,
        zona: dadosCandidato.zona,
      });
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  //GET /:id
  async showAll(req, res, next) {
    const { offset, limit } = req.query;
    const zona = req.payload.id;
    try {
      const candidato = await Candidato.paginate(
        { zona: zona },
        {
          offset: Number(offset || 0),
          limit: Number(limit || 30),
        }
      );
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  async AddCpfCandidato(req, res, next) {
    try {
      const candidato = await Candidato.find({ nome: "Branco" });

      candidato.map(async (item) => {
        item.cpf = "000.000.000-00";
        await item.save();
      });
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  //GET/candidatoZona/:zonaId
  async candidatoZona(req, res, next) {
    console.log(req.params.zonaId);
    try {
      const candidatos = await Candidato.find({
        zona: req.params.zonaId,
        deletado: false,
      });
      console.log(candidatos);
      return res.send({ candidatos });
    } catch (e) {
      next(e);
    }
  }

  //GET/candidatoId/:id
  async candidatoId(req, res, next) {
    try {
      const candidato = await Candidato.findOne({ _id: req.params.id });
      console.log(req.params.id);
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  //GET
  async showAdm(req, res, next) {
    const zona = req.payload.id;
    try {
      const candidato = await Candidato.findOne({
        _id: req.params.id,
        zona: zona,
      });
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  //DELETE /:id
  async remove(req, res, next) {
    try {
      const candidato = await Candidato.findById(req.params.id);
      if (!candidato)
        return res.status(400).send({ error: "Candidato não encontrado." });
      candidato.deletado = true;
      await candidato.save();
      return res.send({ deletado: true });
    } catch (e) {
      next(e);
    }
  }

  // async showSuperAdm(req, res, next) {
  //   try {
  //     const zonaInep = await Zona.findOne({ _id: req.params.id })
  //     const candidatos = await Candidato.find({ inep: zonaInep.inep });
  //     return res.send({ candidatos });
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  async showSuperAdm(req, res, next) {
    try {
      const candidatos = await Candidato.find({})
        .collation({ locale: "en", strength: 1 })
        .sort({ nome: 1 });
      return res.send({ candidatos });
    } catch (e) {
      next(e);
    }
  }

  async searchProtocolo(req, res, next) {
    try {
      const candidato = await Candidato.findOne({
        protocolo: req.body.protocolo,
      });
      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  async store(req, res, next) {
    const dadosCandidato = req.body;

    console.log(dadosCandidato);

    // REGRAS DE PROTOCOLO
    const numRandom = Math.floor(Math.random() * 65536 * Math.random() * 65536);

    // REGRAS DE TEMPOS DE INST E DOCENCIA
    function calculaTempo(data) {
      let dataAtual = new Date();
      let anoAtual = dataAtual.getFullYear();
      let anoDataParts = data.split("/");
      let diaData = anoDataParts[0];
      let mesData = anoDataParts[1];
      let anoData = anoDataParts[2];
      let idade = anoAtual - anoData;
      let mesAtual = dataAtual.getMonth() + 1;
      //Se mes atual for menor que a data informada, nao fez ano ainda;
      if (mesAtual < mesData) {
        idade--;
      } else {
        //Se estiver no mes da data informada, verificar o dia
        if (mesAtual == mesData) {
          if (new Date().getDate() < diaData) {
            //Se a data atual for menor que a data informada ele ainda nao fez ano
            idade--;
          }
        }
      }
      return idade;
    }

    try {
      const candidato = new Candidato({
        cpf: dadosCandidato.cpf,
        nome: dadosCandidato.nome,
        email: dadosCandidato.email,
        telefone: dadosCandidato.telefone,
        // dt_nascimento: dadosCandidato.dt_nascimento,
        // rg: dadosCandidato.rg,
        // endereco: dadosCandidato.endereco,
        cargo: dadosCandidato.cargo,
        funcao: dadosCandidato.funcao,
        matricula: dadosCandidato.matricula,
        // graduacao: dadosCandidato.graduacao,
        //curso_graduacao: dadosCandidato.curso_graduacao,
        //pos_graduacao: dadosCandidato.pos_graduacao,
        //curso_pos_graduacao: dadosCandidato.curso_pos_graduacao,
        // mestrado: dadosCandidato.mestrado,
        // curso_mestrado: dadosCandidato.curso_mestrado,
        // doutorado: dadosCandidato.doutorado,
        // curso_doutorado: dadosCandidato.curso_doutorado,
        curso_gestor: dadosCandidato.curso_gestor,
        obs_curso_gestor: dadosCandidato.obs_curso_gestor,
        //outros_cursos: dadosCandidato.outros_cursos,
        data_entrada_inst: dadosCandidato.data_entrada_inst,
        data_entrada_docencia: dadosCandidato.data_entrada_docencia,
        tempo_modulacao: calculaTempo(
          moment(dadosCandidato.data_entrada_inst).format("DD/MM/YYYY")
        ),
        tempo_docencia: calculaTempo(
          moment(dadosCandidato.data_entrada_docencia).format("DD/MM/YYYY")
        ),
        numero_candidato: dadosCandidato.numero_candidato,
        protocolo: `EDU${numRandom}2021`,
        zona: dadosCandidato.zona,
      });

      await candidato.save();

      return res.send({ candidato });
    } catch (e) {
      console.log(e);
      res.status(422).json({ errors: "CPF já consta no banco" });
      next(e);
    }
  }

  //PUT /images/:id
  async updateFoto(req, res, next) {
    try {
      const candidato = await Candidato.findOne({ _id: req.params.id });
      if (!candidato)
        return res.status(400).send({ error: "Candidato não encontrado." });
      let cpf2 = candidato.cpf;
      cpf2 = cpf2.replace(".", "");
      cpf2 = cpf2.replace(".", "");
      cpf2 = cpf2.replace("-", "");

      imageFileHelper.compressImage(req.file, 1000).then(async (newPath) => {
        const docItem = candidato.foto[0] ? candidato.foto[0] : "";
        if (candidato.foto[0])
          promisify(fs.unlink)(
            path.resolve(
              __dirname,
              "..",
              "tmp",
              "doc__eleicao",
              "candidatos",
              `${cpf2}`,
              docItem
            )
          );
        candidato.foto = newPath;
        await candidato.save();
        return res.send({ candidato });
      });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const {
      nome,
      cpf,
      email,
      telefone,
      endereco,
      rg,
      dt_nascimento,
      cargo,
      funcao,
      graduacao,
      curso_graduacao,
      pos_graduacao,
      curso_pos_graduacao,
      mestrado,
      curso_mestrado,
      doutorado,
      curso_doutorado,
      curso_gestor,
      obs_curso_gestor,
      outros_cursos,
      data_entrada_inst,
      data_entrada_docencia,
      numero_candidato,
      foto,
    } = req.body;
    try {
      const candidato = await Candidato.findById(req.params.id);
      if (nome) candidato.nome = nome;
      if (email) candidato.email = email;
      if (cpf) candidato.cpf = cpf;
      if (telefone) candidato.telefone = telefone;
      if (endereco) candidato.endereco = endereco;
      if (rg) candidato.rg = rg;
      if (dt_nascimento) candidato.dt_nascimento = dt_nascimento;
      if (cargo) candidato.cargo = cargo;
      if (funcao) candidato.funcao = funcao;
      if (graduacao) candidato.graduacao = graduacao;
      if (curso_graduacao) candidato.curso_graduacao = curso_graduacao;
      if (pos_graduacao) candidato.pos_graduacao = pos_graduacao;
      if (curso_pos_graduacao)
        candidato.curso_pos_graduacao = curso_pos_graduacao;
      if (mestrado) candidato.mestrado = mestrado;
      if (curso_mestrado) candidato.curso_mestrado = curso_mestrado;
      if (doutorado) candidato.doutorado = doutorado;
      if (curso_doutorado) candidato.curso_doutorado = curso_doutorado;
      if (curso_gestor) candidato.curso_gestor = curso_gestor;
      if (obs_curso_gestor) candidato.obs_curso_gestor = obs_curso_gestor;
      if (outros_cursos) candidato.outros_cursos = outros_cursos;
      if (data_entrada_inst) candidato.data_entrada_inst = data_entrada_inst;
      if (data_entrada_docencia)
        candidato.data_entrada_docencia = data_entrada_docencia;
      if (numero_candidato) candidato.numero_candidato = numero_candidato;
      if (foto) candidato.foto = foto;
      await candidato.save();

      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }

  async uploadDocs(req, res, next) {
    console.log("teste");
    try {
      const { categoria } = req.query;
      const candidato = await Candidato.findById(req.params.id);
      if (!candidato)
        return res.status(400).send({ error: "Candidato não encontrado." });
      const { filename: file } = req.file;

      let cpf2 = candidato.cpf;
      cpf2 = cpf2.replace(".", "");
      cpf2 = cpf2.replace(".", "");
      cpf2 = cpf2.replace("-", "");

      const docFields = [
        "doc_1",
        "doc_2",
        "doc_3",
        "doc_4",
        "doc_5",
        "doc_6",
        "doc_7",
        "doc_8",
        "doc_9",
        "doc_10",
        "doc_11",
      ];
      docFields.forEach((item) => {
        const docItem = candidato.docs[item].file
          ? candidato.docs[item].file
          : "";
        if (categoria === item)
          promisify(fs.unlink)(
            path.resolve(
              __dirname,
              "..",
              "tmp",
              "doc__eleicao",
              "candidatos",
              `${cpf2}`,
              docItem
            )
          );
        if (categoria.includes(item)) {
          (candidato.docs[item].file = file),
            (candidato.docs[item].original_file = req.file.originalname);
        }
      });

      candidato.markModified("docs");
      await candidato.save();

      return res.send({ candidato });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CandidatoController;
