const router = require("express").Router();

const FuncionarioController = require("../../../controllers/FuncionarioController");
const { ZonaValidation } = require("../../../controllers/validacoes/zonaValidation");
const { AdmValidation } = require("../../../controllers/validacoes/admValidation");
const { FuncionarioValidation } = require("../../../controllers/validacoes/funcionarioValidation");
const upload = require('../../../config/multer');

const validate = require("express-validation");
const auth = require("../../auth");

const funcionarioController = new FuncionarioController();

// ADM
router.get('/', auth.required, ZonaValidation.adm, funcionarioController.indexAdm);
router.get('/funcionarioInep/:inep', auth.required, AdmValidation.adm, funcionarioController.funcionarioInep);
router.get('/:id', auth.required, ZonaValidation.adm, funcionarioController.showAdm);
router.get("/search/:search", auth.required, ZonaValidation.adm, funcionarioController.searchAlunos);
router.get('/lista/lista', funcionarioController.showAll);
router.get('/lista/funcionarios/:id', auth.required, AdmValidation.adm, funcionarioController.showSuperAdm);
router.post("/", funcionarioController.addFuncionario); //testado
// router.post("/", auth.required, AdmValidation.adm, validate(ZonaValidation.store), funcionarioController.store); //testado
router.put("/:id", auth.required, AdmValidation.adm, ZonaValidation.adm, funcionarioController.update); //testado
// router.delete("/:id", auth.required, AdmValidation.adm, validate(ZonaValidation.remove), funcionarioController.remove); //testado
router.delete("/", funcionarioController.remove);

// // POPULAÇÃO
// router.get("/", validate(ZonaValidation.adm), funcionarioController.showAll); //testado
// router.get("/:id", validate(ZonaValidation.adm), funcionarioController.showAdm); //testado



module.exports = router;