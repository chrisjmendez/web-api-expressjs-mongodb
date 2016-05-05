var express = require('express');
var router = express.Router();

var async       = require("async");
var mongojs     = require("mongojs");
var db          = mongojs("myDatabase");
var entries     = db.collection("blog.entries");


router.get('/:anything?', function(req, res, next) {
  res.json({ error: 404, message: "Ooops. Not what you were looking for?"})
  res.render('index', { title: 'Express' });
});

module.exports = router;