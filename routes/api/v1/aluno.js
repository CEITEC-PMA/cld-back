const router = require("express").Router();

const AlunoController = require("../../../controllers/AlunoController");
const {
  ZonaValidation,
} = require("../../../controllers/validacoes/zonaValidation");
const {
  AlunoValidation,
} = require("../../../controllers/validacoes/alunoValidation");
const {
  AdmValidation,
} = require("../../../controllers/validacoes/admValidation");
const upload = require("../../../config/multer");

const validate = require("express-validation");
const auth = require("../../auth");

const alunoController = new AlunoController();

// ADM
router.get("/", auth.required, ZonaValidation.adm, alunoController.indexAdm);
router.get(
  "/alunoZona/",
  auth.required,
  AdmValidation.adm,
  alunoController.alunoZona
);
router.get("/lista", alunoController.showAll);
router.get("/alunoAll", alunoController.showAlunoAll);
router.get(
  "/lista/alunos/:id",
  auth.required,
  AdmValidation.adm,
  alunoController.showSuperAdm
);
router.get("/:id", auth.required, ZonaValidation.adm, alunoController.showAdm);
router.get("/inserir/votante", alunoController.inserirVotante);
router.get(
  "/search/:search",
  auth.required,
  ZonaValidation.adm,
  alunoController.searchAlunos
);
router.post("/", alunoController.addAluno); //testado
// router.post("/", auth.required, AdmValidation.adm, validate(ZonaValidation.store), alunoController.store); //testado
// router.put("/:id", auth.required, ZonaValidation.adm, validate(AlunoValidation.update), alunoController.update); //testado
router.delete("/", alunoController.remove); //testado
router.delete("/removerPorNome", alunoController.removeNome); //testado

// // POPULAÇÃO
// router.get("/", validate(ZonaValidation.adm), alunoController.showAll); //testado
// router.get("/:id", validate(ZonaValidation.adm), alunoController.showAdm); //testado

module.exports = router;
