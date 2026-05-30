const https = require('https');
const fs = require('fs');

const url = 'https://drive.google.com/thumbnail?id=1hJEKgwDk4ziB0WArmLzYNHIHlNO-a-G9&sz=w128';
const dest = 'public/favicon.ico';

https.get(url, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, (res2) => {
      res2.pipe(fs.createWriteStream(dest));
    });
  } else {
    res.pipe(fs.createWriteStream(dest));
  }
}).on('error', (err) => {
  console.error(err);
});
