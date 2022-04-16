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

/* router.route('/post-story')
    .get (function(req, res) {
        res.render('post-story', {title: 'Post a Story'});
    })
    .post(function (req, res) {
        let authorName = req.body.aName;
        let storyDescription = req.body.postDescription;
        let storyImage = req.body.postImage;
        if (!authorName) {
            res.setHeader('Content-Type', 'application/json');
            res.status(403).json({error: 403, reason: 'One of the numbers is invalid'});
        } else {
            let result = "Story Posted!";
            res.json(result);
        }
    }); */
module.exports = router;