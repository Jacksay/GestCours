var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

  if( false ){
    res.send(fs.readFileSync(__dirname +"/../views/app.html"));
  } else {
    res.send(fs.readFileSync(__dirname +"/../views/login.html"));
  }
  res.end();
});

router.get('/datas.json', function(req, res) {
  res.send([]);
});

module.exports = router;
