const router = require("express").Router();

const ZonaController = require("../../../controllers/ZonaController");
const {
  ZonaValidation,
} = require("../../../controllers/validacoes/zonaValidation");
const {
  AdmValidation,
} = require("../../../controllers/validacoes/admValidation");
const upload = require("../../../config/multer");

const validate = require("express-validation");
const auth = require("../../auth");

const zonaController = new ZonaController();

// ADM
router.post(
  "/",
  auth.required,
  AdmValidation.adm,
  validate(ZonaValidation.store),
  zonaController.store
); //testado
router.post(
  "/zonaLote",
  auth.required,
  AdmValidation.adm,
  zonaController.addZonas
); //testado
router.put("/", auth.required, zonaController.update); //testado
router.put(
  "/inep",
  auth.required,
  AdmValidation.adm,
  zonaController.updateInep
); //testado
router.delete(
  "/:id",
  auth.required,
  AdmValidation.adm,
  validate(ZonaValidation.remove),
  zonaController.remove
); //testado
// auth.required, validate(ZonaValidation.update),
// POPULAÇÃO
router.get("/", zonaController.showAll); //testado
router.get(
  "/:id",
  auth.required,
  ZonaValidation.adm,
  validate(ZonaValidation.showAdm),
  zonaController.showAdm
); //testado

module.exports = router;
