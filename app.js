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
      // io.socket.emit('userannounce', {user: socket.username})
    }
    // Broadcast to everyone but self
    socket.broadcast.emit('userannounce', {user: socket.username})


  // Username
    socket.on('showuser', function(data){
      io.sockets.emit('showusertyping', {user: socket.username})
      // console.log(socket.username)
    })


    // Has to be inside the set user to prevent undefined user from posting  messages
    socket.on('send message', function(data){
      io.sockets.emit('show message', {msg: data, user: socket.username});
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

server.listen(port, () => {
  console.log('---Express IO Connected---')
})
