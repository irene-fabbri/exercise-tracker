const app = require('./app')
const DB = require('./connect')

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

// DB SETUP
DB((err) => {
    if (err) {
        console.error('Database setup failed:', err);
        process.exit(1); // Exit the process if the setup fails
    }
});

// Start the Express server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
