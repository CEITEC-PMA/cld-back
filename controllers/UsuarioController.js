const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const Zona = mongoose.model("Zona");
const enviarEmailRecovery = require("../helpers/email-recovery");

class UsuarioController {
  //GET /
  index(req, res, next) {
    Zona.findById(req.payload.id)
      .then((usuario) => {
        if (!usuario)
          return res.status(401).json({ errors: "Usuário não Registrado" });
        return res.json({ usuario: usuario.enviarAuthJSON() });
      })
      .catch(next);
  }

  //GET /:id
  show(req, res, next) {
    Usuario.findById(req.params.id)
      .then((usuario) => {
        if (!usuario)
          return res.status(401).json({ errors: "Usuario não registrado" });
        return res.json({
          usuario: {
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
          },
        });
      })
      .catch(next);
  }

  //POST /registrar
  store(req, res, next) {
    const { nome, username, password } = req.body;

    const usuario = new Usuario({ nome, username });
    usuario.setSenha(password);
    usuario
      .save()
      .then(() => res.json({ usuario: usuario.enviarAuthJSON() }))
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }

  //PUT /
  // update(req, res, next) {
  //     const { nome, email, password } = req.body;
  //     Usuario.findById(req.payload.id).then((usuario) => {
  //         if (!usuario) return res.status(401).json({ errors: "Usuario não registrado" });
  //         if (typeof nome !== "undefined") usuario.nome = nome;
  //         if (typeof email !== "undefined") usuario.email = email;
  //         if (typeof password !== "undefined") usuario.setSenha(password);

  //         return usuario.save().then(() => {
  //             return res.json({ usuario: usuario.enviarAuthJSON() });
  //         }).catch(next);
  //     }).catch(next);
  // }
  update(req, res, next) {
    const { nome, inep, password } = req.body;
    Zona.findOne({ inep })
      .then((zona) => {
        if (!zona)
          return res.status(401).json({ errors: "zona não registrado" });
        if (typeof nome !== "undefined") zona.nome = nome;
        if (typeof !zona.hash) zona.setSenha(password);
        if (typeof password !== "undefined") zona.setSenha(password);
        return zona
          .save()
          .then(() => {
            return res.json({ zona: zona.enviarAuthJSON() });
          })
          .catch(next);
      })
      .catch(next);
  }
  //DELETE /
  remove(req, res, next) {
    Usuario.findById(req.payload.id)
      .then((usuario) => {
        if (!usuario)
          return res.status(401).json({ errors: "Usuario não registrado" });
        usuario.deletado = true;
        return usuario
          .save()
          .then(() => {
            return res.json({ deletado: true });
          })
          .catch(next);
      })
      .catch(next);
  }

  //POST /login
  // async login(req, res, next) {
  //     const { inep, password } = req.body;
  //     await Zona.findOne({ inep }).then((usuario) => {
  //         if (!usuario) return res.status(401).json({ errors: "Usuario não registrado" });
  //         if (!usuario.validarSenha(password)) return res.status(401).json({ errors: "Senha inválida" });
  //         return res.json({ usuario: usuario.enviarAuthJSON() });
  //     }).catch(next);
  // }
  async login(req, res, next) {
    const { inep, password } = req.body;
    console.log(`Minha senha é: ${password} e meu inep é: ${inep}`);
    await Zona.findOne({ inep })
      .then((usuario) => {
        if (!usuario)
          return res.status(401).json({ errors: "Usuario não registrado" });
        if (!usuario.validarSenha(password))
          return res.status(401).json({ errors: "Senha inválida" });
        return res.json({ usuario: usuario.enviarAuthJSON() });
      })
      .catch((e) => {
        console.log(e);
        next(e);
      });
  }

  //RECOVERY
  //GET /recuperar-senha
  showRecovery(req, res, next) {
    return res.render("recovery", { error: null, success: null });
  }

  //POST /recuperar-senha
  createRecovery(req, res, next) {
    const { email } = req.body;
    if (!email)
      return res.render("recovery", {
        error: "Preencha com o seu email",
        success: null,
      });

    Usuario.findOne({ email })
      .then((usuario) => {
        if (!usuario)
          return res.render("recovery", {
            error: "Não existe usuário com este email",
            success: null,
          });
        const recoveryData = usuario.criarTokenRecuperacaoSenha();
        return usuario
          .save()
          .then(() => {
            enviarEmailRecovery(
              { usuario, recovery: recoveryData },
              (error = null, success = null) => {
                return res.render("recovery", { error, success });
              }
            );
          })
          .catch(next);
      })
      .catch(next);
  }

  //GET / senha-recuperada
  showCompleteRecovery(req, res, next) {
    if (!req.query.token)
      return res.render("recovery", {
        error: "Token não identificado",
        success: null,
      });
    Usuario.findOne({ "recovery.token": req.query.token })
      .then((usuario) => {
        if (!usuario)
          return res.render("recovery", {
            error: "Não existe usuário com este token",
            success: null,
          });
        if (new Date(usuario.recovery.date) < new Date())
          return res.render("recovery", {
            error: "Token expirado. Tente novamente.",
            success: null,
          });
        return res.render("recovery/store", {
          error: null,
          success: null,
          token: req.query.token,
        });
      })
      .catch(next);
  }

  //POST /senha-recuperada
  completeRecovery(req, res, next) {
    const { token, password } = req.body;
    if (!token || !password)
      return res.render("recovery/store", {
        error: "Preencha novamente com sua nova senha",
        success: null,
        token: token,
      });
    Usuario.findOne({ "recovery.token": token }).then((usuario) => {
      if (!usuario)
        return res.render("recovery", {
          error: "Usuario nao identificado",
          success: null,
        });

      usuario.finalizarTokenRecuperacaoSenha();
      usuario.setSenha(password);
      return usuario
        .save()
        .then(() => {
          return res.render("recovery/store", {
            error: null,
            success: "Senha alterada com sucesso. Tente novamente fazer login.",
            token: null,
          });
        })
        .catch(next);
    });
  }
}

module.exports = UsuarioController;
