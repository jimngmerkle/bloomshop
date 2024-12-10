const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const https = require('https');

// Amplify Params - DO NOT EDIT
const BLOOMREACH_PROJECT_ID = process.env.BLOOMREACH_PROJECT_ID;
const BLOOMREACH_API_KEY = process.env.BLOOMREACH_API_KEY;

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

/****************************
* POPULATE CATALOG PUT method *
****************************/

app.put('/populate-catalog/:catalogId', function(req, res) {
  const catalogId = req.params.catalogId;
  const payload = req.body;
  const BLOOMREACH_API_URL = `https://api-demoapp.exponea.com/data/v2/projects/${BLOOMREACH_PROJECT_ID}/catalogs/${catalogId}/items`;

  const options = {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${BLOOMREACH_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    }
  };

  let requestBody;
  try {
    requestBody = req.body;
  } catch (error) {
    console.error("Error parsing request body:", error);
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
  }

  console.log("Sending request to Bloomreach API:", BLOOMREACH_API_URL);
  console.log("Request body:", JSON.stringify(requestBody));

  const apiReq = https.request(BLOOMREACH_API_URL, options, (apiRes) => {
    let apiData = '';
    apiRes.on('data', (chunk) => {
      apiData += chunk;
    });
    apiRes.on('end', () => {
      console.log("Bloomreach API response:", apiData);
      if (apiRes.statusCode === 200) {
        res.status(200).json({ success: true, data: apiData });
      } else {
        console.error("Bloomreach API error:", apiData);
        res.status(apiRes.statusCode).json({ success: false, error: apiData });
      }
    });
  });

  apiReq.on('error', (error) => {
    console.error("Error in API request:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  });

  apiReq.write(JSON.stringify(requestBody));
  apiReq.end();
});

app.listen(3000, function() {
});

module.exports = app;