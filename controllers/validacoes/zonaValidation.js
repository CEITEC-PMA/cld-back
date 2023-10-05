const BaseJoi = require("joi");
const mongoose = require("mongoose");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);
const Zona = mongoose.model("Zona");
const pattern = "[A-Z]{3}[0-9][0-9A-Z][0-9]{2}";

const ZonaValidation = {
  adm: (req, res, next) => {
    if (!req.payload.id) return res.sendStatus(401);
    const zona = req.payload.id;
    if (!zona) return res.sendStatus(401);
    Zona.findById(req.payload.id)
      .then((zona) => {
        if (!zona) return res.sendStatus(401);
        if (!zona.role.includes("adm")) return res.sendStatus(401);
        next();
      })
      .catch(next);
  },

  showAdm: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
  },
  store: {
    body: {
      nome: Joi.string().required(),
      inep: Joi.string().required(),
      password: Joi.string().required(),
    },
  },

  update: {
    body: {
      password: Joi.string().required(),
    },
    body: {
      nome: Joi.string().optional(),
      coordenador_geral: Joi.string().optional(),
      coordenador_pedagogico: Joi.string().optional(),
      diretor: Joi.string().optional(),
    },
  },
  remove: {
    params: {
      id: Joi.string().alphanum().length(24).required(),
    },
  },
};

module.exports = {
  ZonaValidation,
};
