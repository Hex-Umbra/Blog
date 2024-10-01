const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    titre: String,
    content: String,
    date: Date
})

