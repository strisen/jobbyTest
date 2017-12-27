const express = require('express')
const router = express.Router()

const passport = require('../helpers/ppInformation')

const isLoggedIn = require('../helpers/loginBlock')



const HomeController = require('../controllers/homeController')
const AuthController = require('../controllers/AuthController')



// const tweet = require('../helpers/twitter')
//
// var stream = tweet.stream('statuses/filter', { track: ['train delays again']})
//
// stream.on('tweet', function(tweet){
//   console.log(tweet)
//   console.log(tweet.text)
//   // stream.emit('tweets', {tweet: tweet.text})
// })

//Home none auth access
router.get('/', HomeController.index)
router.get('/home', isLoggedIn ,HomeController.home)



//User auth
router.get('/auth/login', AuthController.login) //login route
router.post('/auth/login',
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: 'Invalid username and/or password',
        successFlash: 'You have logged in'
 })) //login post route


router.get('/auth/register', AuthController.register) //register route
router.post('/auth/register', AuthController.signup) //register post route
router.get('/auth/logout', AuthController.logout)

module.exports = router
