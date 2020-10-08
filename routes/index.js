var express = require('express');
var router = express.Router();
var connectMongo = require("../config/db");
var uploadFiles = require('./uploadFiles.js')
connectMongo();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("../views/HomePage.ejs",{title:"HomePage"});
});
router.use('/uploads',uploadFiles);
module.exports = router;