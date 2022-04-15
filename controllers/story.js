let storySchema = require('../models/story');

exports.insert = function (req, res) {
    let storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }

        let story = new storySchema({
            author: storyData.author,
            title: storyData.title,
            description: storyData.description,
            img: storyData.img
        });
        console.log('received: ' + story);

        story.save()
            .then ((results) => {
                    console.log(results._id);
                res.json(storyData);
            })
            .catch ((error) => {
                res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
            })

}
