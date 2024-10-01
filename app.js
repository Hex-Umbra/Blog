const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
//

require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_DB = process.env.DB_CONNECTION;

//

app.use(express.json())

//
app.get("/", (req,res)=>{
    res.send("Root page of the blog")
})
app.get("/yes/:id", (req,res)=>{
  const {id} = req.params;
  res.json(id)
})

//

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("Connecting to the DB");
    app.listen(PORT, () => console.log(`Listening here http://localhost:${PORT}`));
  })
  .catch((err) => console.log(err));