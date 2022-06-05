const express = require('express');
// const storyControl = require("../controllers/story");
const router = express.Router();


router.route('/create')
    .get(function(req, res) {
        res.render('create-room', {
            title: 'Create a new room'
        })
    })

router.route('/room')
    .get(function(req, res) {
        res.render('chat-room', {
            title: 'Chat Room'
        })
    })

module.exports = router;