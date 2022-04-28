var express = require('express');
const storyControl = require("../controllers/story");
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Choose an Option' });
// });
router.route('/')
    .get(function(req, res) {
      res.render('index', { title: 'Choose an Option'});
    })
    .post(storyControl.getPosts)


module.exports = router;
