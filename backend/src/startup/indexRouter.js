// routes/index.js
import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  // res.render("index", { title: "Express" }); targets public/index.html
  res.send("Hello World");
});

export default router;
