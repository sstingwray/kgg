var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/nu-avalon', function(req, res, next) {
  res.render('nuavalon', { title: 'Nu Avalon Dashboard' });
});

router.get('/pnp-main', function(req, res, next) {
  res.render('pnp-main', { title: 'PnP Tools' });
});

router.get('/experimental-v1', function(req, res, next) {
  res.render('experimental-v1', { title: 'Experimental' });
});

router.get('/experimental-v2', function(req, res, next) {
  res.render('experimental-v2', { title: 'Experimental' });
});

module.exports = router;
