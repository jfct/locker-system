import { Router } from 'express';
import RentController from '../controllers/rent.controller';
import { handleValidationErrors } from '../middleware/handle-validation.middleware';
import RentService from '../services/rent.service';
import { createRentValidator, updateRentValidator } from '../validations/rent.validation';
import { idValidation } from '../validations/validation';

const rentRouter = Router();
const rentService = new RentService();
const rentController = new RentController(rentService);

// GET
rentRouter.get('/:id', idValidation, handleValidationErrors, rentController.get.bind(rentController));

// POST
rentRouter.post('/', createRentValidator, handleValidationErrors, rentController.create.bind(rentController));

// We remove the update for the rent individually because this is tightly coupled with locker
// So we only allow for this in specific endpoints on the delivery facade system
// PUT
rentRouter.put('/:id', [...idValidation, ...updateRentValidator], handleValidationErrors, rentController.update.bind(rentController));

// DELETE
rentRouter.delete('/:id', idValidation, handleValidationErrors, rentController.delete.bind(rentController));

export default rentRouter;