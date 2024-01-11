const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: "./.env" });

// AMBIENTE
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3055;

// VERSÃO TESTE
const dbURI = isProduction ? process.env.DB_PRODUCTION : process.env.DB_LOCAL;

const Startup = async () => {
  console.log(dbURI);
  try {
    mongoose.connect(dbURI, {
      useNewUrlParser: true,
    });
    console.log("connected to mongo");
  } catch (e) {
    console.log(e);
  }

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Rodando na //localhost:${PORT}`);
  });
};

Startup();
