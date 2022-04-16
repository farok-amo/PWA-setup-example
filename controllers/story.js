let storySchema = require('../models/story');

exports.insert = function (req, res) {
    let storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
       // buf = storyData.toUpload.split(',')[1];

        let story = new storySchema({
            author: storyData.aName,
            title: "Very Cool and Mysterious Title",
            description: storyData.postDescription,
            img: storyData.toUpload
        });
        console.log('received: ' + story);

        story.save()
            .then ((results) => {
                    console.log(results._id);
            })
            .catch ((error) => {
                console.log('catch');
                res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
            })

}
