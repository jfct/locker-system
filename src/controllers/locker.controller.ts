import { CreateLockerDto } from "../dto/locker.dto";
import LockerService from "../services/locker.service";
import BaseController from "./base.controller";


class LockerController extends BaseController<CreateLockerDto> {
    constructor(protected readonly service: LockerService) {
        super();
    }
}

export default LockerController;