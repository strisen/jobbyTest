const passport = require('../helpers/ppInformation')
const User = require('../models/user');

// getLoginPage
exports.login = (req, res)=>{
    res.render('auth/login')
}


//getRegisterPage
exports.register = (req, res)=>{
    res.render('auth/register')
}

exports.logout =(req, res)=>{
  req.logout()
  req.flash('success', 'You are now logged out!' )
  res.redirect('/auth/login')
}

//post Register
exports.signup = (req, res) =>{

  req.checkBody('firstname', 'First Name cannot be empty').notEmpty()
  req.checkBody('lastname', 'Last Name cannot be empty').notEmpty()
  req.checkBody('username', 'Username cannot be empty').notEmpty()
  req.checkBody('email', 'Email cannot be empty').notEmpty()
  req.checkBody('email', 'Email cannot be empty').isEmail()
  req.checkBody('password', 'Password cannot be empty').notEmpty()
  req.checkBody('password2', 'Password cannot be empty').notEmpty()
  req.checkBody('password', 'Password is not equal to password 2').equals(req.body.password2)


  let errors = req.validationErrors()
  console.log(errors);
  if(errors){
    res.render('auth/register', { errors : errors})
  }else{

    User.create({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        password: req.body.password,
        username : req.body.username
    },(err, createdUser)=>{

      if(err){
        req.flash('error', 'Could not create user account');
        res.redirect('/auth/register');
      }
      else{
             //Send user to auth page of profile
               passport.authenticate('local', {
                            successRedirect: '/',
                            successFlash: 'Account created and logged in'
                          })(req, res);
            }

      })
  }
}
