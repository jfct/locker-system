import { param } from "express-validator";

export const idValidation = [
    param('id').isUUID().withMessage('Invalid Id provided')
]
