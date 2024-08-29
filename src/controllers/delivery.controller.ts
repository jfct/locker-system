import { NextFunction, Response } from "express";
import BloqService from "../services/bloq.service";
import DeliveryService from "../services/delivery.service";
import LockerService from "../services/locker.service";
import RentService from "../services/rent.service";
import { IdParams, RequestWithBody, RequestWithParams } from "../types/custom-types";
import { CreateDeliveryParams } from "../types/delivery";


// Very specific business logic, not an entity like, so we do not extend it
class DeliveryController {
    protected service: DeliveryService;

    constructor(
        private bloqService: BloqService,
        private lockerService: LockerService,
        private rentService: RentService
    ) {
        this.service = new DeliveryService(this.bloqService, this.lockerService, this.rentService);
    }

    public async allocateRent(req: RequestWithBody<CreateDeliveryParams>, res: Response, next: NextFunction) {
        try {
            const bloqId = req.body.bloqId;
            const rentId = req.body.rentId;
            const data = await this.service.allocateRent(bloqId, rentId);

            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    public async dropoffRent(req: RequestWithParams<IdParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const data = await this.service.dropOffRent(id);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    public async pickupRent(req: RequestWithParams<IdParams>, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            const data = await this.service.pickupRent(id);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default DeliveryController;