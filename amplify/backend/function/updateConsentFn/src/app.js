const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const https = require('https');

// Amplify Params - DO NOT EDIT
const BLOOMREACH_PROJECT_ID = process.env.BLOOMREACH_PROJECT_ID;
const BLOOMREACH_API_KEY = process.env.BLOOMREACH_API_KEY;
const BLOOMREACH_CONSENT_API_URL = `https://api-demoapp.exponea.com/track/v2/projects/${BLOOMREACH_PROJECT_ID}/batch`;

// Declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET,PUT,DELETE");
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**********************
 * Example get method *
 **********************/

app.get('/api', function(req, res) {
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/api/*', function(req, res) {
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/api', function(req, res) {
  res.json({success: 'post call succeed!', url: req.url, body: req.body});
});

app.post('/api/*', function(req, res) {
  res.json({success: 'post call succeed!', url: req.url, body: req.body});
});

/****************************
* Check Email post method *
****************************/

app.post('/check-email', function(req, res) {
  const payload = req.body;

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${BLOOMREACH_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    }
  };

  const apiReq = https.request(BLOOMREACH_CONSENT_API_URL, options, (apiRes) => {
    let apiData = '';
    apiRes.on('data', (chunk) => {
      apiData += chunk;
    });
    apiRes.on('end', () => {
      console.log("Bloomreach API response:", apiData);
      if (apiRes.statusCode === 200) {
        res.status(200).json({ success: true, data: apiData });
      } else {
        res.status(apiRes.statusCode).json({ success: false, error: apiData });
      }
    });
  });

  apiReq.on('error', (error) => {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  });

  apiReq.write(JSON.stringify(payload));
  apiReq.end();
});

/****************************
* Example put method *
****************************/

app.put('/api', function(req, res) {
  res.json({success: 'put call succeed!', url: req.url, body: req.body});
});

app.put('/api/*', function(req, res) {
  res.json({success: 'put call succeed!', url: req.url, body: req.body});
});

/****************************
* Example delete method *
****************************/

app.delete('/api', function(req, res) {
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/api/*', function(req, res) {
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;