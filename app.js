const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const articleRoutes = require("./routes/articleRoutes");
//

require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_DB = process.env.DB_CONNECTION;

//

app.use(cors());
app.use(express.json());
app.use(articleRoutes);

//
app.get("/", (req, res) => {
  res.send("Root page of the blog");
});

//

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("Connecting to the DB");
    app.listen(PORT, () =>
      console.log(`Listening here http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(err));
