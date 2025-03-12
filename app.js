const express = require(`express`);
const cors = require('cors');
const bodyParser = require('body-parser');
const DB = require('./connect');

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
  console.log(DB);
  // TODO: get a list of all users (array of obj with user_id and username)
  res.set('content-type', 'application/json');
  const sql = `SELECT * FROM users`;
  let data = {users:[]};

  DB.all(sql,[], (err,rows)=>{
    if(err){
      const error = new Error('Error retrieving users');
      error.status = 500;
      error.code = 'USER_RETRIEVAL_ERROR';
      error.title = 'User Retrieval Error';
      error.detail = 'There was an issue retrieving users from the database.';
      return next(error);
    }

    rows.forEach(row => {
      // console.log(row);
      data.users.push({'username': row.username,'_id':row.user_id});
    });
    res.status(200).json(data);
  })
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
// ERROR HANDLING
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    "errors": [
      {
          "status": `${error.status || 500}`,
          "code": `${error.code || 'UNKNOWN_ERROR'}`,
          "title": `${error.title || 'An unexpected error occurred'}`,
          "detail": `${error.detail || error.message || 'No additional details available.'}`
      }
  ]
  });
});

// Export the app instance for testing
module.exports = app;