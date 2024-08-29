import { Router } from "express";
import LockerController from "../controllers/locker.controller";
import { handleValidationErrors } from "../middleware/handle-validation.middleware";
import LockerService from "../services/locker.service";
import { createLockerValidation, updateLockerValidation } from "../validations/locker.validation";
import { idValidation } from "../validations/validation";

const lockerRouter = Router();
const lockerService = new LockerService();
const lockerController = new LockerController(lockerService);

// GET
lockerRouter.get('/:id', idValidation, handleValidationErrors, lockerController.get.bind(lockerController));
// TODO: A list of lockers?
//lockerRouter.get('/', [...idValidation, ...getLockersByBloqValidation], handleValidationErrors, lockerController.get.bind(lockerController));

// POST
lockerRouter.post('/', createLockerValidation, handleValidationErrors, lockerController.create.bind(lockerController));

// PUT
lockerRouter.put('/:id', [...idValidation, ...updateLockerValidation], handleValidationErrors, lockerController.update.bind(lockerController));

// DELETE
lockerRouter.delete('/:id', idValidation, handleValidationErrors, lockerController.delete.bind(lockerController));

export default lockerRouter;