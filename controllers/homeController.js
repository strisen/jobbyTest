const User = require('../models/user')
const Tweet = require('../models/tweet')
// Index Home Page
exports.index = (req, res) => {
  Tweet.find({}, (err, tweets) => {
    if(err) return err
    res.render('home', {'tweets' : tweets})
  })
  // res.render('home')
}

// Index Home Page
exports.home = (req, res) => {
  res.render('home')
}
