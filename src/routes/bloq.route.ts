import { Router } from 'express';
import BloqController from '../controllers/bloq.controller';
import { handleValidationErrors } from '../middleware/handle-validation.middleware';
import BloqService from '../services/bloq.service';
import { createBloqValidator, updateBloqValidator } from '../validations/bloq.validation';
import { idValidation } from '../validations/validation';


const bloqRouter = Router();
const bloqService = new BloqService()
const bloqController = new BloqController(bloqService);

// GET
bloqRouter.get('/', bloqController.getAll.bind(bloqController));
bloqRouter.get('/:id', idValidation, handleValidationErrors, bloqController.get.bind(bloqController));

// POST
bloqRouter.post('/', createBloqValidator, handleValidationErrors, bloqController.create.bind(bloqController));

// PUT 
bloqRouter.put('/:id', [...idValidation, ...updateBloqValidator], handleValidationErrors, bloqController.update.bind(bloqController));

// DELETE
bloqRouter.delete('/:id', idValidation, handleValidationErrors, bloqController.delete.bind(bloqController));

export default bloqRouter;