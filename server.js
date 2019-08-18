'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '93c278164e54da0e42176a9d44ce4412',
    channelAccessToken: '/UcAoPAfj7dyVPlg1xh99GFfcJNnWlV2OmtZ7dKIJG9S5Xn8tJt7uM3+e0gP7Fx7CMCoZMkYMeBKX9Jd3Pl2iqsDyuodHhU+k7kf+JW7tobITt+Oqfqpjuu8z2yBvdcXhMYD694C11b3uTRI9DLXBwdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = '';

  if(event.message.text === 'こんにちは') {
    replyText = 'こんばんはの時間ですよ'
  } else {
    replyText = 'うざ'
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText //実際に返信の言葉を入れる箇所
  });
}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);