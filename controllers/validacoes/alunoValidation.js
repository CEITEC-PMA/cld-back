const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);
const pattern = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}";

const AlunoValidation = {
  showAdm: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
    query: {
      zona: Joi.string().alphanum().length(24).required(),
    },
  },
  showAll: {
    query: {
      zona: Joi.string().alphanum().length(24).required(),
    },
  },
  search: {
    query: {
      zona: Joi.string().alphanum().length(24).required(),
    },
  },

  store: {
    body: {
      nome: Joi.string().required(),
      responsavel1: Joi.string().required(),
      responsavel2: Joi.string().optional(),
      responsavel3: Joi.string().optional(),
      inep: Joi.string().required(),
      serie: Joi.string().required(),
    },

    remove: {
      query: {
        zona: Joi.string().alphanum().length(24).required(),
      },
      params: {
        id: Joi.string().alphanum().length(24).required(),
      },
    },
  },
};

module.exports = {
  AlunoValidation,
};
