# Node.js URL Shortener Microservice

This is a simple Node.js URL Shortener Microservice.
Detailed instructions for building this project can be found at https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.

### Project requirements

- You can POST a URL to `/api/shorturl` and get a JSON response with `original_url` and `short_url` properties. Here's an example: `{ original_url : 'https://freeCodeCamp.org', short_url : 1}`
- When you visit `/api/shorturl/<short_url>`, you will be redirected to the original URL.
- If you pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain `{ error: 'invalid url' }`

### Project configuration

You will need a MongoDB database on MongoDB Atlas. You can create a free account at https://www.mongodb.com. You will need to get the `connection string` and put it in the dotenv file.

### Useful commands

To run this repository, first install the required packages:

```
$ npm install
```

And to run the server:

```
$ node server.js
```

Alternatively, if you have **nodemon** installed globally for automatic refreshing of the server when changes are made:

```
$ nodemon server.js
```

You can install nodemon with:

```
$ npm install -g nodemon
```
