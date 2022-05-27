'use strict';

require('dotenv').config();
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use('/styles', express.static(`${process.cwd()}/styles`));
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Main page
app.get('/', (req, res) => {
  let path = process.cwd() + '/views/index.html';
  res.sendFile(path, error => {
    if (error) next(error);
    console.log("Served: index.html");
  });
});

app.listen(port, error => {
  if (error) return console.log(error);
  console.log(`Server running on PORT ${port}`);
});

// Export the Express API
module.export = app;