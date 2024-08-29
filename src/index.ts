import express from 'express';
import mongoose from 'mongoose';
import { config } from './config';
import { globalErrorHandler } from './middleware/global-error-handler.middleware';
import apiRouter from './routes';

// Mongoose connection
mongoose.connect(config.mongodb.uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('MongoDB connection error:', error)
    });

// App start
const app = express();
app.use(express.json());

// Import all routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

// Global handler for errors
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Bloq service running on port ${PORT}`));

export { app };
