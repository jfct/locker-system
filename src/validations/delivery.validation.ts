import { body } from "express-validator";

export const createDeliveryValidation = [
    body('bloqId')
        .isUUID()
        .notEmpty()
        .withMessage('bloqId is required and must be an UUID'),
    body('rentId')
        .isUUID()
        .notEmpty()
        .withMessage('rentId is required and must be an UUID'),
];
