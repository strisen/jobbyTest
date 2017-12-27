const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tweetSchema = new Schema({
    tweetUser :{
      type: String
    },
    tweetContent :{
      type: String
    },
    tweetDate :{
      type: String
    },
    tweetId :{
      type: String
    },
    created_at :{
      type: Date,
      default : Date.now
    }
})

const Tweet = mongoose.model('Tweet', tweetSchema)
module.exports = Tweet
