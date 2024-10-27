//Importation des librairies/documents
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const session = require("express-session")
const articleRoutes = require("./routes/articleRoutes");
const newUserRoutes = require("./routes/userRoutes");

//Importation des variables d'environnement
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_DB = process.env.DB_CONNECTION;

//Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
//Routes
app.use("/articles",articleRoutes);
app.use(newUserRoutes);
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
