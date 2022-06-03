const express = require('express');
// const storyControl = require("../controllers/story");
const router = express.Router();


router.route('/create')
    .get(function(req, res) {
        res.render('create-room', {
            title: 'Create a new room',
            storyID: req.query.storyID,
            post: req.query.getPosts()
        })
    })

module.exports = router;