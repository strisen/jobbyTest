const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const session = require('express-session')
const expressValidator = require('express-validator')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require('path')
const server = require('http').createServer(app)
//sockets runs on server not express
const io = require('socket.io')(server)
const flash = require('connect-flash')
const passport = require('passport')
const port = process.env.PORT || 3000;

const routes = require('./routes/routes')
const dbConfig = require('./config/dbConfig')
const Twit = require('twit')
const util = require('util')
// console.log(dbConfig)

mongoose.Promise = global.Promise
mongoose.connect(dbConfig.urllive, {useMongoClient : true})
.then(()=>{console.log('Mongoose ok')}, (err)=>{console.log(err)})

app.use(cookieParser()); //read cookies
app.use(bodyParser.json()); // get info from html forms

app.use(session({
  secret: 'iamwdi13classof2017',
  resave: false,
  saveUninitialized: true,
}))

// Passport =============
app.use(passport.initialize());
app.use(passport.session());

// flash messages for express

app.use(flash());
app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Express validator

app.use(expressValidator({
  errorFormatter : (param, msg, value) => {
      let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root

        while(namespace.length){
          formParam += '['+ namespace.shift()+ ']'
        }

        return {
          param : formParam,
          msg : msg,
          value : value
        }
  }
}))

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public'))) //set static path to public
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
//app.set('views', (path.join(__dirname, 'views')))
app.set('view engine', 'handlebars')

//routes ============================================================

app.use('/', routes)

// Chat room
let users = []
var numUsers = 0;

io.on('connection', function(socket){
  console.log('a user connected')

  // Set Username
  socket.on('set user', (data, callback) => {
    if(users.indexOf(data) != -1){
      callback(false);
    }
    else{
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsers();
      // Sends to everyone including self
      io.sockets.emit('userannounce', {user: socket.username})
    }
    // Broadcast to everyone but self
    // socket.broadcast.emit('userannounce', {user: socket.username})


  // Username
    socket.on('showuser', function(data){
      io.sockets.emit('showusertyping', {user: socket.username})
      // console.log(socket.username)
    })


    // Has to be inside the set user to prevent undefined user from posting  messages
    socket.on('send message', function(data){
      if(data != ""){
        // console.log(typeof(data))
      io.sockets.emit('show message', {msg: data, user: socket.username});
    }
     // console.log('message: ' + msg);
   });


  })

  socket.on('disconnect', function(data){
    // console.log('user disconnected');
    if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsers();
  });

  function updateUsers(){
    io.sockets.emit('users', users)
  }



})

// Twitter

const tweet = require('./helpers/twitter')
const Tweet = require('./models/tweet')

function calculateSince(datetime)
{
  var tTime=new Date(datetime);
  var cTime=new Date();
  var sinceMin=Math.round((cTime-tTime)/60000);
  if(sinceMin==0)
  {
      var sinceSec=Math.round((cTime-tTime)/1000);
      if(sinceSec<10)
        var since='less than 10 seconds ago';
      else if(sinceSec<20)
        var since='less than 20 seconds ago';
      else
        var since='half a minute ago';
  }
  else if(sinceMin==1)
  {
      var sinceSec=Math.round((cTime-tTime)/1000);
      if(sinceSec==30)
        var since='half a minute ago';
      else if(sinceSec<60)
        var since='less than a minute ago';
      else
        var since='1 minute ago';
  }
  else if(sinceMin<45)
      var since=sinceMin+' minutes ago';
  else if(sinceMin>44&&sinceMin<60)
      var since='about 1 hour ago';
  else if(sinceMin<1440){
      var sinceHr=Math.round(sinceMin/60);
  if(sinceHr==1)
    var since='about 1 hour ago';
  else
    var since='about '+sinceHr+' hours ago';
  }
  else if(sinceMin>1439&&sinceMin<2880)
      var since='1 day ago';
  else
  {
      var sinceDay=Math.round(sinceMin/1440);
      var since=sinceDay+' days ago';
  }
  return since;
};

// console.log(Tweet.length)

tweet.get('search/tweets', {q: 'smrt train delay OR fault OR disruption, -press', count: 10, tweet_mode:'extended', result_type:'recent'}, function(err, data, res){
  // console.log(data)
  // console.log(util.inspect(data.statuses, false, null))
  // console.log(data.statuses)
  // let tweetData = JSON.stringify(data.statuses)
  // util.inspect(data.statuses, false, null)
  // console.log(tweetData.full_text)
  Tweet.collection.remove({}, (err)=>{
    if(err)return err

    console.log('emptied')
  })
  for(let i=0; i<data.statuses.length; i++){
  // let tweets = data.statuses[i]
  // console.dir(tweets.retweeted_status.full_text)
  if(data.statuses[i].retweeted_status){
  // Tweet.create({
  //   tweetContent: "RETWEET: " + data.statuses[i].retweeted_status.full_text,
  //   tweetDate: data.statuses[i].created_at
  // }, (err, createdTweet)=>{
  //   if(err){return err}
  //   else{
  //     console.log('success Retweet')
  //   }
  // })
  // return;
}
else {
  let newTime = data.statuses[i].created_at;
  // let reDate = newDate.split(" ");

  console.log(calculateSince(newTime))
  // console.log(reDate[2]+" "+reDate[1]+" "+reDate[5]+" "+reDate[3])
  // let xeDate = new Date
  // console.log(reDate[2]+"-"+reDate[1]+"-"+reDate[5]+" "+reDate[3]+" "+"UTC")
  // console.log(xeDate)
  // let date = [];
  // date.push(data.statuses)
  // console.dir(data.statuses[i].created_at)
  setTimeout(()=>{
  Tweet.create({
    tweetUser: "@"+data.statuses[i].user.screen_name,
    tweetContent: data.statuses[i].full_text,
    tweetId: data.statuses[i].id,
    tweetDate: calculateSince(newTime)
  }, (err, createdTweet)=>{
    if(err){return err}
    else{
      console.log('success Normal Tweet' + i)
    }
  })}, 1000)
}
}
})

var stream = tweet.stream('statuses/filter', { track: 'smrt delays,smrt train delay,singapore train delay,smrt train fault,smrt train disruption,smrt disruption,smrt track fault,smrt fault'})

stream.on('tweet', function(tweet){
  console.log(tweet)
  console.log(tweet.text)
  Tweet.create({
    tweetContent : tweet.text,
    tweetId : tweet.id,
    tweetDate: calculateSince(tweet.created_at)
  }, (err, createdTweet)=>{
    if(err){return err}
    else{
      console.log('success2')
    }
    // console.log(Tweet)
  })
})

server.listen(port, () => {
  console.log('---Express IO Connected---')
})
