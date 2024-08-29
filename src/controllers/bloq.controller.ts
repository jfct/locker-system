import { NextFunction, Request, Response } from "express";
import { CreateBloqDto } from "../dto/bloq.dto";
import BloqService from "../services/bloq.service";
import BaseController from "./base.controller";


class BloqController extends BaseController<CreateBloqDto> {
    protected service: BloqService;

    constructor() {
        super();
        this.service = new BloqService();
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.service.getAll();
            if (!data) {
                return res.status(404).json({ status: 'error', message: 'Id not found' });
            }

            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default BloqController;