import { body, param } from "express-validator";

export const createBloqValidator = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),

    body('address')
        .notEmpty().withMessage('Address is required')
        .isString().withMessage('Address must be a string')
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
];

export const updateBloqValidator = [
    param('id')
        .notEmpty().withMessage('Bloq ID is required')
        .isUUID().withMessage('Invalid Bloq ID'),

    body('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),

    body('address')
        .optional()
        .isString().withMessage('Address must be a string')
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
];

export const getBloqValidator = [
    param('id')
        .notEmpty().withMessage('Bloq ID is required')
        .isUUID().withMessage('Invalid Bloq ID'),
];

export const deleteBloqValidator = [
    param('id')
        .notEmpty().withMessage('Bloq ID is required')
        .isUUID().withMessage('Invalid Bloq ID'),
];
