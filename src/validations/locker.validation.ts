import { body, param, query } from 'express-validator';
import { LockerStatus } from '../types/locker';

export const createLockerValidation = [
    body('bloqId')
        .isString()
        .notEmpty()
        .withMessage('bloqId is required and must be a string'),
    body('status')
        .isIn(Object.values(LockerStatus))
        .withMessage('Invalid locker status'),
    body('isOccupied')
        .optional()
        .isBoolean()
        .withMessage('isOccupied must be a boolean'),
];

export const updateLockerValidation = [
    param('id')
        .isString()
        .notEmpty()
        .withMessage('Locker ID is required'),
    body('bloqId')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('bloqId must be a non-empty string'),
    body('status')
        .optional()
        .isIn(Object.values(LockerStatus))
        .withMessage('Invalid locker status'),
    body('isOccupied')
        .optional()
        .isBoolean()
        .withMessage('isOccupied must be a boolean'),
];


export const deleteLockerValidation = [
    param('id')
        .isString()
        .notEmpty()
        .withMessage('Locker ID is required'),
];

export const getLockerValidation = [
    param('id')
        .isString()
        .notEmpty()
        .withMessage('Locker ID is required'),
];

export const getLockersByBloqValidation = [
    query('bloqId')
        .isString()
        .notEmpty()
        .withMessage('bloqId is required and must be a string'),
];