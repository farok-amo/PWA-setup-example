var express = require('express');
var router = express.Router();
var storyControl = require('../controllers/story');

// router.get('/post-story', function(req, res, next) {
//     res.render('post-story', { title: 'Upload a Story' });
// });

router.route('/post-story')
    .get (function(req, res) {
    res.render('post-story', {title: 'Post a Story'});
    })
    .post(storyControl.insert);

module.exports = router;