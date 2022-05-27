'use strict';

require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortId = require('shortid');
const validUrl = require('valid-url');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use('/styles', express.static(`${process.cwd()}/styles`));
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Database connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s 
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Main page
app.get('/', (req, res) => {
  let path = process.cwd() + '/views/index.html';
  res.sendFile(path, error => {
    if (error) next(error);
    console.log("Served: index.html");
  });
});

// Define schema
const Schema = mongoose.Schema;
const urlSchema = new Schema({
  original_url: String,
  short_url: String
});
const URL = mongoose.model('URL', urlSchema);

app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url_input;
  const urlCode = shortId.generate();

  // Check if the URL is valid
  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({ error: 'invalid URL' });
  }

  try {
    // Check if the URL is already in the database
    let findOne = await URL.findOne({ original_url: url });
    if (findOne) return res.json({
      original_url: findOne.original_url,
      short_url: findOne.short_url
    })

    // If it doesn't exist, create a new one and return a response with the result
    findOne = new URL({
      original_url: url,
      short_url: urlCode
    });
    await findOne.save();
    return res.json({
      original_url: findOne.original_url,
      short_url: findOne.short_url
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'unable to create short URL' });
  }
});

app.get('/api/shorturl/:short_url?', async (req, res) => {
  try {
    const urlParams = await URL.findOne({ short_url: req.params.short_url });

    // Redirect to the original URL if it exists in the database
    if (urlParams) return res.redirect(urlParams.original_url);

    return res.status(404).json({ error: 'URL not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to redirect' });
  }
});

app.listen(port, error => {
  if (error) return console.log(error);
  console.log(`Server running on PORT ${port}`);
});

// Export the Express API
module.export = app;