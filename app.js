// PACOTES
const compression = require("compression");
const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const isProduction = process.env.NODE_ENV === "production";

//IMPORTANDO .ENV
dotenv.config({ path: "./.env" });

// START
const app = express();

// ARQUIVOS ESTATICOS
app.use("/public", express.static(__dirname + "/public"));
app.use(
  "/public/doc__boletim",
  express.static(__dirname + "/public/doc__eleicao")
);
app.use(
  "/fotosCandidato",
  express.static(path.resolve(__dirname, "tmp", "doc__eleicao", "candidatos"))
);

// SETUP EJS
app.set("view engine", "ejs");

// CONFIGURACOES
if (!isProduction) app.use(morgan("dev"));
if (!isProduction) app.use(cors());
app.disable("x-powered-by");
app.use(compression());

// SETUP BODY PARSER
app.use(express.urlencoded({ extended: true, limit: 1.5 * 1024 * 1024 }));
app.use(express.json({ limit: 1.5 * 1024 * 1024 }));

// MODELS
require("./models");
// ROTAS
app.use("/", require("./routes"));

// 404 - ROTA
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// ROTA - 422, 500, 401
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.status !== 404) console.warn("Error: ", err.message, new Date());
  res.json(err);
});

module.exports = app;
