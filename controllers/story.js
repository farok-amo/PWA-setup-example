let storySchema = require('../models/story');

exports.insert = function (req, res) {
    let storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
       // buf = storyData.toUpload.split(',')[1];

        let story = new storySchema({
            author: storyData.aName,
            title: storyData.postTitle,
            description: storyData.postDescription,
            img: storyData.toUpload
        });

        story.save()
            .then ((results) => {
                    console.log(results._id);
                res.json("Story uploaded successfully!");
            })
            .catch ((error) => {
                console.log('catch');
                res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
            })

}

exports.getPosts = function (req, res) {
    storySchema.find({})
        .then(posts => {
            if (posts.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(posts));
            } else {
                res.json("Sorry! No Posts to view");
            }
        })
        .catch((err) => {
            res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });
}

