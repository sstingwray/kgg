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

router.get('/experimental', function(req, res, next) {
  res.render('experimental', { title: 'Experimental' });
});

module.exports = router;
