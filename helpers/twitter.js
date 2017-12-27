const Twit = require('twit')
// const tweets = require('../models/tweets')


var tweet = new Twit({
  consumer_key: 'adSW0229EQXuUqS6bn5LdK3uh',
  consumer_secret: 'qwtuaCaOB3wSIXVy4r4D72N2n2Cf5oqn168JU1lD0m0F3gYc6n',
  access_token: '509883554-z7EVUBTRz6klxh6JazJnNZlowSDj8gAxf5N5i6zc',
  access_token_secret: '1KzbbYKqRCuzl32KTDMIrF6VVj0IdWe2PuHrb0Ov9KHPz',
  timeout_ms: 60*1000,
})


module.exports = tweet
