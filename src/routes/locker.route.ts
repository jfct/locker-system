import { Router } from "express";
import LockerController from "../controllers/locker.controller";
import { handleValidationErrors } from "../middleware/handle-validation.middleware";
import LockerService from "../services/locker.service";
import { createLockerValidation } from "../validations/locker.validation";
import { idValidation } from "../validations/validation";

const lockerRouter = Router();
const lockerService = new LockerService();
const lockerController = new LockerController(lockerService);

// GET
lockerRouter.get('/:id', idValidation, handleValidationErrors, lockerController.get.bind(lockerController));

// POST
lockerRouter.post('/', createLockerValidation, handleValidationErrors, lockerController.create.bind(lockerController));

// We remove the update for the locker individually because this is tightly coupled with rent
// So we only allow for this in specific endpoints on the delivery facade system
// PUT
// lockerRouter.put('/:id', [...idValidation, ...updateLockerValidation], handleValidationErrors, lockerController.update.bind(lockerController));

// DELETE
lockerRouter.delete('/:id', idValidation, handleValidationErrors, lockerController.delete.bind(lockerController));

export default lockerRouter;