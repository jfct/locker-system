import { Router } from 'express';
import BloqController from '../controllers/bloq.controller';
import { handleValidationErrors } from '../middleware/handleValidation.middleware';
import { createBloqValidator, updateBloqValidator } from '../validations/bloq.validation';
import { idValidation } from '../validations/validation';


const bloqRouter = Router();
const bloqController = new BloqController();

// GET
bloqRouter.get('/:id', idValidation, handleValidationErrors, bloqController.get.bind(bloqController));

// POST
bloqRouter.post('/', createBloqValidator, handleValidationErrors, bloqController.create.bind(bloqController));

// PUT
bloqRouter.put('/:id', [...idValidation, ...updateBloqValidator], handleValidationErrors, bloqController.update.bind(bloqController));

// DELETE
bloqRouter.delete('/:id', idValidation, handleValidationErrors, bloqController.delete.bind(bloqController));

export default bloqRouter;