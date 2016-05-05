var express = require('express');
var router = express.Router();


router.get('/:anything?', function(req, res, next) {
  res.json({ error: 404, message: "Ooops. Not what you were looking for?"})
  res.render('index', { title: 'Express' });
});

module.exports = router;