import { NextFunction, Response } from "express";
import DeliveryService from "../services/delivery.service";
import { IdParams, RequestWithBody, RequestWithParams } from "../types/custom-types";
import { CreateDeliveryParams } from "../types/delivery";


// Very specific business logic, not an entity like, so we do not extend it
class DeliveryController {
    constructor(
        protected readonly service: DeliveryService,
    ) { }

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