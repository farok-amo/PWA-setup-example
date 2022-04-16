const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: String,
        data: Buffer,
        contentType: String,
        required: false
    }
},
{timestamps: true})

storySchema.pre('validate', function(next) {
  if (this.title) {
    //VALIDATORS
  }

  next()
})

module.exports = mongoose.model('storySchema', storySchema)