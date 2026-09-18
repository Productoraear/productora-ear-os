const https = require('https');

const testUrl = "https://celebrents.s3.amazonaws.com/cobi%2Fmedia%2Fcct61%2Fcache%2F65%2Fe9%2F65e9451f983d3d4c3680698ee444adbc.jpg";

https.get(testUrl, (res) => {
  console.log('Status code for Celebrents S3 without :443:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
}).on('error', (err) => {
  console.error('Error fetching Celebrents image:', err.message);
});
