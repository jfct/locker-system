import { CreateRentDto } from "../dto/rent.dto";
import RentService from "../services/rent.service";
import BaseController from "./base.controller";


class RentController extends BaseController<CreateRentDto> {
    constructor(protected readonly service: RentService) {
        super();
    }
}

export default RentController;