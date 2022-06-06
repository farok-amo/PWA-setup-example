var express = require('express');
const storyControl = require("../controllers/story");
var router = express.Router();

/**
 * route to the index page
 */
router.route('/')
    .get(function(req, res) {
      res.render('index', { title: 'Choose an Option'});
    })
    .post(storyControl.getPosts)


module.exports = router;
