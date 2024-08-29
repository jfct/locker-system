import { Router } from 'express';
import DeliveryController from '../controllers/delivery.controller';
import { handleValidationErrors } from '../middleware/handle-validation.middleware';
import BloqService from '../services/bloq.service';
import LockerService from '../services/locker.service';
import RentService from '../services/rent.service';
import { createDeliveryValidation } from '../validations/delivery.validation';
import { idValidation } from '../validations/validation';


const deliveryRouter = Router();

// Services
const bloqService = new BloqService();
const rentService = new RentService();
const lockerService = new LockerService();

// Controller
const deliveryController = new DeliveryController(bloqService, lockerService, rentService);

// POST
deliveryRouter.post('/allocate-rent', [...createDeliveryValidation], handleValidationErrors, deliveryController.allocateRent.bind(deliveryController));
deliveryRouter.post('/dropoff-rent/:id', idValidation, handleValidationErrors, deliveryController.dropoffRent.bind(deliveryController));
deliveryRouter.post('/pickup-rent/:id', idValidation, handleValidationErrors, deliveryController.pickupRent.bind(deliveryController));

export default deliveryRouter;