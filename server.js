'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: '93c278164e54da0e42176a9d44ce4412',
    channelAccessToken: 'pSLwVUHjSZaTE2hwoJgwnb+YceAB/JcKr95VhiXXk4FRS7DghRvZmqT2Beop+tEjCMCoZMkYMeBKX9Jd3Pl2iqsDyuodHhU+k7kf+JW7toYtJLs5XewE5ilH7MazH9R1NhnUOVwKCkXIg8hMyYKgewdB04t89/1O/w1cDnyilFU='
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

  let mes = '';

  if(event.message.text === '天気教えて') {
    mes = 'ちょっと待ってね';
    getNodeVer(event.source.userId)
  } else {
    mes = '「天気教えて」って言ってね';
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes //実際に返信の言葉を入れる箇所
  });
}

const getNodeVer = async (userId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=270000');
  const item = res.data;

  await client.pushMessage(userId, {
    type: 'text',
    text: item.description.text;
  })
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);