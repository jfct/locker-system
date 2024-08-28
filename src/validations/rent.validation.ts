import { body, query } from "express-validator";
import { RentSize, RentStatus } from "../types/rent";

export const createRentValidator = [
    body('weight')
        .isNumeric()
        .withMessage('Weight must be a number'),
    body('size')
        .isIn(Object.values(RentSize))
        .withMessage('Invalid rent size'),
    body('status')
        .isIn(Object.values(RentStatus))
        .withMessage('Invalid rent status'),
    body('lockerId')
        .optional()
        .isUUID()
        .withMessage('Invalid locker Id'),
    body('droppedOffAt')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Invalid drop-off date'),
    body('pickedUpAt')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Invalid pick-up date'),
];

export const updateRentValidator = [
    body('weight')
        .optional()
        .isNumeric()
        .withMessage('Weight must be a number'),
    body('size')
        .optional()
        .isIn(Object.values(RentSize))
        .withMessage('Invalid rent size'),
    body('status')
        .optional()
        .isIn(Object.values(RentStatus))
        .withMessage('Invalid rent status'),
    body('lockerId')
        .optional()
        .isUUID()
        .withMessage('Invalid locker Id'),
    body('droppedOffAt')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Invalid drop-off date'),
    body('pickedUpAt')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Invalid pick-up date'),
];

export const getRentsValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('status')
        .optional()
        .isIn(Object.values(RentStatus))
        .withMessage('Invalid rent status'),
    query('size')
        .optional()
        .isIn(Object.values(RentSize))
        .withMessage('Invalid rent size'),
    query('lockerId')
        .optional()
        .isUUID()
        .withMessage('Invalid locker Id'),
];