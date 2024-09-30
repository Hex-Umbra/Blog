const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//

require("dotenv").config();
const PORT = process.env.PORT;

//

const app = express();
app.get("/", (req,res)=>{
    res.send("Hello Comrade")
})

//

app.listen(PORT, ()=>{
    console.log(`Listening here: http://localhost:${PORT}`);
    
})