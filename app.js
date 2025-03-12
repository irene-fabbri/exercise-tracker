const express = require(`express`);
const cors = require('cors');
const DB = require('./connect')
var bodyParser = require('body-parser')

const app = express ();

app.use(bodyParser.json());
app.use(cors());


// Allow for GET or POST method
app.use((req, res, next) => {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).send({
      "errors": [
          {
              "status": "405",
              "code": "method-not-allowed",     
              "title": "Method not allowed",
              "detail": "Request metod MUST be GET or POST"
          }
      ]
    });
  }
  next();
});

app.get('/api/users',  (req,res) => {
  // TODO: get a list of all users (array of obj with user_id and username)
});

app.post('/api/users',  (req,res) => {
  // TODO: create a new user, returns obj with id and username)
});

app.post('/api/users/:_id/exercises',  (req,res) => {
  // TODO: create a new exercise for user with data, description, duration, and optionally date. If no date is supplied, the current date will be used. returns obj with username, description, duration, date, _id)
});

app.get('/api/users/:_id/logs',  (req,res) => {
  // TODO: retrieve a full exercise log of any user with a count property representing the number of exercises that belong to that user
  // TODO: You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
});

// Centralized error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Export the app instance for testing
module.exports = app;