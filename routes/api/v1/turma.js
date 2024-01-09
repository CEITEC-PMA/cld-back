const router = require("express").Router();

const TurmaController = require("../../../controllers/TurmaController");
const {
  ZonaValidation,
} = require("../../../controllers/validacoes/zonaValidation");

const auth = require("../../auth");

const turmaController = new TurmaController();

router.post("/", auth.required, ZonaValidation.adm, turmaController.store); //testado
router.get("/", auth.required, ZonaValidation.adm, turmaController.findAll); //testado
router.get("/:id", auth.required, ZonaValidation.adm, turmaController.findOne); //testado
router.put("/:id", auth.required, ZonaValidation.adm, turmaController.update); //testado
router.post("/:id", auth.required, ZonaValidation.adm, turmaController.remove); //testado

module.exports = router;
