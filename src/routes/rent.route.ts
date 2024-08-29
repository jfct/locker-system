import { Router } from 'express';
import RentController from '../controllers/rent.controller';
import { handleValidationErrors } from '../middleware/handle-validation.middleware';
import { createRentValidator, updateRentValidator } from '../validations/rent.validation';
import { idValidation } from '../validations/validation';

const rentRouter = Router();
const rentController = new RentController();

// GET
rentRouter.get('/:id', idValidation, handleValidationErrors, rentController.get.bind(rentController));
// TODO: A list of rents?
// rentRouter.get('/', getRentsValidator, validate, getRents);

// POST
rentRouter.post('/', createRentValidator, handleValidationErrors, rentController.create.bind(rentController));

// PUT
rentRouter.put('/:id', [...idValidation, ...updateRentValidator], handleValidationErrors, rentController.update.bind(rentController));

// DELETE
rentRouter.delete('/:id', idValidation, handleValidationErrors, rentController.delete.bind(rentController));

export default rentRouter;