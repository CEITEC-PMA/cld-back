const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);
const pattern = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}";

const CandidatoValidation = {
  showAdm: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
  },
  search: {
    query: {
      zona: Joi.string().alphanum().length(24).required(),
    },
  },
  store: {
    body: {
      //dt_nascimento: Joi.date().format("YYYY-MM-DD").raw().required(),
      nome: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Nome não pode ficar vazio.",
          };
        }),
      cpf: Joi.string()
        .length(14)
        .required()
        .error(() => {
          return {
            message: "CPF não pode ficar vazio.",
          };
        }),
      email: Joi.string()
        .email()
        .required()
        .error(() => {
          return {
            message: "E-mail inválido.",
          };
        }),
      //rg: Joi.string().required(),
      telefone: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Telefone não pode ficar vazio.",
          };
        }),
      cargo: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Cargo não pode ficar vazio.",
          };
        }),
      funcao: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Função não pode ficar vazio.",
          };
        }),
      //graduacao: Joi.boolean().required(),
      //curso_graduacao: Joi.string().optional().allow(''),
      //pos_graduacao: Joi.boolean().required(),
      //curso_pos_graduacao: Joi.string().optional().allow(''),
      //mestrado: Joi.boolean().required(),
      //curso_mestrado: Joi.string().optional().allow(''),
      //doutorado: Joi.boolean().required(),
      //curso_doutorado: Joi.string().optional().allow(''),
      curso_gestor: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Curso de gestor não pode ficar vazio.",
          };
        }),
      obs_curso_gestor: Joi.string().optional().allow(""),
      //outros_cursos: Joi.boolean().optional().allow(''),
      data_entrada_inst: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Data de entrada na instituição não pode ficar vazio.",
          };
        }),
      data_entrada_docencia: Joi.string()
        .required()
        .error(() => {
          return {
            message: "Data de início da docência não pode ficar vazio.",
          };
        }),
      // endereco: Joi.object({
      //   cep: Joi.string().required(),
      //   rua: Joi.string().required(),
      //   complemento: Joi.string().optional().allow(''),
      //   cidade: Joi.string().required(),
      //   uf: Joi.string().required(),
      //   bairro: Joi.string().required(),
      //   numero: Joi.string().required()
      // }).required()
    },
  },

  updateFoto: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
    query: {
      cpf: Joi.string().length(14).required(),
    },
  },

  update: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
    body: {
      nome: Joi.string().optional(),
      cpf: Joi.string().length(14).optional(),
      email: Joi.string().email().optional(),
      // rg: Joi.string().optional(),
      cargo: Joi.string().optional(),
      funcao: Joi.string().optional(),
      // graduacao: Joi.boolean().optional(),
      // curso_graduacao: Joi.string().optional(),
      // pos_graduacao: Joi.boolean().optional(),
      // curso_pos_graduacao: Joi.string().optional(),
      //mestrado: Joi.boolean().optional(),
      // curso_mestrado: Joi.string().optional(),
      // doutorado: Joi.boolean().optional(),
      // curso_doutorado: Joi.string().optional(),
      curso_gestor: Joi.string().optional(),
      obs_curso_gestor: Joi.string().optional(),
      //outros_cursos: Joi.boolean().optional(),
      tempo_modulacao: Joi.string().optional(),
      tempo_docencia: Joi.string().optional(),
      //telefones: Joi.array().items(Joi.string()).optional(),
      // endereco: Joi.object({
      //   cep: Joi.string().required(),
      //   rua: Joi.string().required(),
      //   complemento: Joi.string(),
      //   bairro: Joi.string().required(),
      //   cidade: Joi.string().required(),
      //   uf: Joi.string().required(),
      //   numero: Joi.string().required()
      // }).optional(),
      //dt_nascimento: Joi.date().format("YYYY-MM-DD").raw().optional()
    },
  },

  remove: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
  },

  uploadDocs: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
    query: {
      cpf: Joi.string().length(14).required(),
      categoria: Joi.string().required(),
    },
  },
};

module.exports = {
  CandidatoValidation,
};
