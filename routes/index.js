var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Choose an Option' });
});

router.get('/join-room', function(req, res, next) {
  res.render('join-room', { title: 'Join a Room or Create a new one' });
});

router.get('/post-story', function(req, res, next) {
  res.render('post-story', { title: 'Upload a Story' });
});

module.exports = router;
