import { NextFunction, Request, Response } from "express";
import { CreateLockerDto } from "../dto/locker.dto";
import LockerService from "../services/locker.service";
import BaseController from "./base.controller";


class LockerController extends BaseController<CreateLockerDto> {
    protected service: LockerService;

    constructor() {
        super();
        this.service = new LockerService();
    }

    /**
 * 
 * In this endpoint we will look for open lockers in the bloq that match the rent's size/weight
 * 
 */
    public async storeRent(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.service.checkOpenLockers(req.params.id);
            if (!data) {
                return res.status(404).json({ status: 'error', message: 'Id not found' });
            }

            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default LockerController;