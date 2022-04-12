var express = require('express');
var router = express.Router();

router.get('/join', function(req, res, next) {
  res.render('join-room', { title: 'Join a Room' });
});

router.get('/create', function(req, res, next) {
    res.render('join-room', { title: 'Create a new room' });
});

module.exports = router;