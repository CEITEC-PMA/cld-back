const router = require("express").Router();

const VotoController = require("../../../controllers/VotoController");
const {
  ZonaValidation,
} = require("../../../controllers/validacoes/zonaValidation");
const {
  AdmValidation,
} = require("../../../controllers/validacoes/admValidation");

const validate = require("express-validation");
const auth = require("../../auth");

const votoController = new VotoController();

// POPULAÇÃO
// router.get("/", auth.required, votacaoController.showAll); //testado

// ADM

router.post("/", auth.required, ZonaValidation.adm, votoController.store); //testado
router.post("/:id", auth.required, AdmValidation.adm, votoController.storeAdm); //testado
//router.get("/", auth.required, ZonaValidation.adm, votoController.store); //testado
// router.put('/images/:id', auth.required, validate(VotacaoValidation.updateFoto), upload.array('file', 1), votacaoController.updateFoto); //testado
router.get("/", auth.required, AdmValidation.adm, votoController.showAll); //testado
router.get(
  "/dadosQuorum",
  auth.required,
  ZonaValidation.adm,
  votoController.getDadosQuorum
); //testado
router.get(
  "/dadosQuorum/:id",
  auth.required,
  AdmValidation.adm,
  votoController.getDadosQuorumAdm
); //testado
// router.get("/:id", auth.required, validate(VotacaoValidation.showAdm), votacaoController.showAdm); //testado
// router.put("/:id", auth.required, validate(VotacaoValidation.update), votacaoController.update); //testado
// router.delete("/:id", auth.required, votacaoController.removeAdm); //testado

module.exports = router;
