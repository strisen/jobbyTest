$(document).ready(function(){
  let messages = []
  let socket = io()
  let chatForm = $('#chatForm')
  let message = $('#chatInput')
  let chatWindow = $('#chatWindow')
  let userForm = $('#userForm')
  let username = $('#username')
  let users = $('#users')
  let error = $('#error')
  let i = 0;
  let cw;
  let chatUi = $('#chatUI')

  // Submit User Form
  userForm.on('submit', function(e){
    socket.emit('set user', username.val(), function(data){
      if(data){
        $('#userFormWrap').hide();
        $('#mainWrap').show();
      } else {
        error.html('Username is taken');
      }
    });
    e.preventDefault();
  });

  // Submit Chat Form
  chatForm.on('submit', function(e){
    socket.emit('send message', message.val());
    message.val('');
    e.preventDefault();
  });

  // Show new user
  socket.on('userannounce', function(data){
    chatWindow.append('<div id="'+i+'"><strong>'+data.user+' has joined the channel.</strong></div>')

    i++;

    // chatWindow.append('<strong>'+data.user+' has joined the channel.</strong><br>')
  })

  // Show message
  socket.on('show message', function(data){

    chatWindow.append('<div id="'+ i +'"><strong>'+data.user+'</strong>: '+data.msg+'</div>');

    //
    // if(i > 6){
    //   $('#' + (i-7)).remove();
    // }

    // chatWindow.append('<strong>'+data.user+'</strong>:'+data.msg+'</div><br>')

    cw = document.getElementById(i)
    console.log(cw)
    cw.scrollIntoView(false);

    i++;


  });

  // Display Usernames
  socket.on('users', function(data){
    let html = '';
    for(let i = 0;i < data.length;i++){
      html += '<li class="list-group-item">'+data[i]+'</li>';
    }
    users.html(html);
  });

  // Grab username on keyup
  message.on('keyup', function(e){
    socket.emit('showuser', username.val())
    // console.log(username.val())
  })

  // Display the typing message
  socket.on('showusertyping', function(data){
      // $('#showmetheuser').empty()
      // $('#showmetheuser').append(data.user + " is typing...")
      // setTimeout(function(){
      //   $('#showmetheuser').empty()
      // }, 1000)

      $('#test').remove()
      chatUi.append("<div id='test' style='position: absolute; '><strong>" + data.user + " is typing...</strong></div>")
      setTimeout(function(){
        $('#test').remove()
      }, 500)
  })

//Twitter test bed
// setInterval(function(){
//   let x = document.querySelector('.tweettest')
//   // location.reload()
//   $('.tweettest').load(location.href)
//   console.log("refreshed!")
// }, 10000)

// const tweet = require('./helpers/twitter')

let twitterFeed = document.querySelector('.tweettest');

twitterFeed.scrollIntoView(false);


});
