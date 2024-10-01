//Importation des librairies/documents
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const articleRoutes = require("./routes/articleRoutes");

//Importation des variables d'environnement
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_DB = process.env.DB_CONNECTION;

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use(articleRoutes);

//Connection to DB and Local server

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("Connecting to the DB");
    app.listen(PORT, () =>
      console.log(`Listening here http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(err));
