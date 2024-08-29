import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { HttpException } from "../errors/http-exception";

export const globalErrorHandler: ErrorRequestHandler = (
    error: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof SyntaxError && 'body' in error) {
        return res.status(400).send({ status: 'error', message: 'Invalid JSON' });
    }

    // TODO: Logging for now
    console.error('# ERROR #', error);

    if (error instanceof mongoose.mongo.MongoError) {
        res.status(422).json({ status: 'error', message: error.message })
    } else if (error instanceof HttpException) {
        res.status(error.errorCode).json({ status: 'error', message: error.message });
    } else if (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }

    next();
}