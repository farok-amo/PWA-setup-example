var express = require('express');
var router = express.Router();
var storyControl = require('../controllers/story');

/**
 * route to post a story
 */
router.route('/post-story')
    .get (function(req, res) {
    res.render('post-story', {title: 'Post a Story'});
    })
    .post(storyControl.insert);

module.exports = router;