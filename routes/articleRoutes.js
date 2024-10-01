const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const articleModel = require("../models/articleModel");

//Routes

router.get("/articles", async (req, res) => {
  try {
    const articles = await articleModel.find();
    res.status(200).json(articles);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
  }
});

router.post("/articles/new", async (req, res) => {
  try {
    const newArticle = req.body;
    await articleModel.create(newArticle);
    res.status(200).json({ message: "All is good" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
  }
});

router.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articleModel.findById(id);
    res.status(200).json(article);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
  }
});

router.put("/articles/:id", async (req, res) => {
    try {
        const {id} = req.params
        const modifiedArticle =await articleModel.findByIdAndUpdate(id, req.body);
        res.status(200).json({message : `L'article ${modifiedArticle} a bien été modifié`});
    } catch (error) {
        res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
    }
});
router.delete("/articles/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const deletedArticle = await articleModel.findByIdAndDelete(id)
        res.status(200).json({message : `L'article sur ${deletedArticle.titre} a bien été supprimé`});
    } catch (error) {
        res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
    }
})

//
module.exports = router;
