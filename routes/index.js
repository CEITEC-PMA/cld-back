const router = require("express").Router();

router.use("/api/v1", require("./api/v1/"));
router.get("/", (req, res, next) =>
  res.send({
    title: "API Controle-livros",
    version: "0.0.1",
  })
);

router.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.erros).reduce(function (errors, key) {
        errors[key] = err.errors[key.message];
        return errors;
      }, {}),
    });
  }
  return next(err);
});

module.exports = router;
