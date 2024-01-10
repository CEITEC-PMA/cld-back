const router = require("express").Router();

router.use("/zona", require("./zona"));
router.use("/funcionario", require("./funcionario"));
router.use("/usuarios", require("./usuarios"));
router.use("/horarioBrasilia", require("./horarioBrasilia"));
router.use("/turma", require("./turma"));

module.exports = router;
