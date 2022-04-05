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
        required: true,
        data: Buffer,
        contentType: String
    },
    createdAt: {
        type: Date,
        default: Date.now.toLocaleDateString()
    }
})

storySchema.pre('validate', function(next) {
  if (this.title) {
    //VALIDATORS
  }

  next()
})

module.exports = mongoose.model('Story', storySchema) 