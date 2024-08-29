import { body, query } from 'express-validator';
import { LockerStatus } from '../types/locker';

export const createLockerValidation = [
    body('bloqId')
        .isUUID()
        .notEmpty()
        .withMessage('bloqId is required and must be an UUID'),
    body('status')
        .isIn(Object.values(LockerStatus))
        .withMessage('Invalid locker status'),
    body('isOccupied')
        .optional()
        .isBoolean()
        .withMessage('isOccupied must be a boolean'),
];

export const updateLockerValidation = [
    body('bloqId')
        .optional()
        .isUUID()
        .notEmpty()
        .withMessage('bloqId must be a non-empty UUID'),
    body('status')
        .optional()
        .isIn(Object.values(LockerStatus))
        .withMessage('Invalid locker status'),
    body('isOccupied')
        .optional()
        .isBoolean()
        .withMessage('isOccupied must be a boolean'),
];

export const getLockersByBloqValidation = [
    query('bloqId')
        .isUUID()
        .notEmpty()
        .withMessage('bloqId is required and must be an UUID'),
];

