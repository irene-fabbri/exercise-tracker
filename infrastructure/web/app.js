import express from 'express';
import cors from 'cors';

import { apiRoutes } from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createError } from './utils/createError.js';

const app = express ();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({  extended: false }));

app.use('/api', apiRoutes);

// Catch all invalid routes
app.use((req, res, next) => {
    next(createError(
        'Route not found',
        404,
        'not_found',
        'Not Found'
    ));
});

app.use(errorHandler);

// Export the app instance for testing
export { app };