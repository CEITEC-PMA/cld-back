const mongoose = require("mongoose");
const Zona = mongoose.model("Zona");
const Usuario = mongoose.model("Usuario");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const EmailController = require("./EmailController");

class ZonaController {
  /**
   *
   * ADM
   *
   */

  //GET /:id
  async showAll(req, res, next) {
    try {
      const zona = await Zona.find({ deletado: false }, "_id nome inep");
      return res.send({ zona });
    } catch (e) {
      next(e);
    }
  }

  //GET
  async showAdm(req, res, next) {
    try {
      const zona = await Zona.findOne({ _id: req.params.id });
      return res.send({ zona });
    } catch (e) {
      next(e);
    }
  }

  //DELETE /:id
  async remove(req, res, next) {
    try {
      const zona = await Zona.findById(req.params.id);
      if (!zona) return res.status(400).send({ error: "Zona não encontrada." });
      zona.deletado = true;
      await zona.save();
      return res.send({ deletado: true });
    } catch (e) {
      next(e);
    }
  }

  // POST /
  async store(req, res, next) {
    try {
      const { nome, inep, password, email } = req.body;
      const zona = new Zona({
        nome,
        password,
        inep,
        email,
      });
      console.log(zona);
      zona.setSenha(password);
      await zona.save();
      return res.json({ zona: zona.enviarAuthJSON() });
    } catch (e) {
      res.status(422).json({ errors: "Usuário já consta no banco" });
      next(e);
    }
  }

  async update(req, res, next) {
    const { password } = req.body;
    try {
      console.log(req.payload.id);
      const zona = await Zona.findOne({ _id: req.payload.id });
      if (password) zona.setSenha(password);
      zona.acesso = 1;

      await zona.save();
      return res.send({ zona });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  /*RESETAR SENHA DE UM INEP*/
  async updateInep(req, res, next) {
    const { inep } = req.body;
    try {
      const zona = await Zona.findOne({ inep: inep }).then((item) => {
        item.setSenha("123456");
        item.acesso = 0;
        item.save();
      });
      return res.send({ zona });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ZonaController;
