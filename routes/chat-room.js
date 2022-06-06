const express = require('express');
// const storyControl = require("../controllers/story");
const router = express.Router();

/**
 * route to create a room for users to chat
 */
router.route('/create')
    .get(function(req, res) {
        res.render('create-room', {
            title: 'Create a new room'
        })
    })

/**
 * route to join the room
 */
router.route('/room')
    .get(function(req, res) {
        res.render('chat-room', {
            title: 'Chat Room'
        })
    })

module.exports = router;