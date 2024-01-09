const router = require("express").Router();

router.use("/candidato", require("./candidato"));
router.use("/votacao", require("./votacao"));
router.use("/zona", require("./zona"));
router.use("/aluno", require("./aluno"));
router.use("/funcionario", require("./funcionario"));
router.use("/usuarios", require("./usuarios"));
router.use("/horarioBrasilia", require("./horarioBrasilia"));
router.use("/voto", require("./voto"));
router.use("/turma", require("./turma"));

module.exports = router;
