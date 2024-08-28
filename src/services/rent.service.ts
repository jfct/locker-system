import { CreateRentDto } from "../dto/rent.dto";
import RentModel, { IRent } from "../models/rent.model";
import BaseService from "./base.service";


class RentService extends BaseService<IRent, CreateRentDto, typeof RentModel> {
    constructor() {
        super(RentModel);
    }
}

export default RentService;