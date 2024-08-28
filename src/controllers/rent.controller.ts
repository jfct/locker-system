import { CreateRentDto } from "../dto/rent.dto";
import RentService from "../services/rent.service";
import BaseController from "./base.controller";


class RentController extends BaseController<CreateRentDto> {
    protected service: RentService;

    constructor() {
        super();
        this.service = new RentService();
    }
}

export default RentController;