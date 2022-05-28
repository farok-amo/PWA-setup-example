var express = require('express');
const storyControl = require("../controllers/story");
var router = express.Router();

router.get('/join', function(req, res, next) {
  res.render('join-room', { title: 'Join a Room' });
});

router.route('/create')
    .get(function(req, res) {
        res.render('create-room', {
            title: 'Create a new room',
            storyID: req.query.storyID,
            storyTitle: req.query.storyTitle,
            storyImg: req.query.storyImg,
            storyAuthor: req.query.storyAuthor
        })
    })

module.exports = router;