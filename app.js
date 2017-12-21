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


app.listen(port, () => {
  console.log('---Express Connected---')
})
