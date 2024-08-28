import { CreateLockerDto } from "../dto/locker.dto";
import LockerService from "../services/locker.service";
import BaseController from "./base.controller";


class LockerController extends BaseController<CreateLockerDto> {
    protected service: LockerService;

    constructor() {
        super();
        this.service = new LockerService();
    }
}

export default LockerController;