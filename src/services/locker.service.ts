import { CreateLockerDto } from "../dto/locker.dto";
import Locker, { ILocker } from "../models/locker.model";
import BaseService from "./base.service";


class LockerService extends BaseService<ILocker, CreateLockerDto, typeof Locker> {
    constructor() {
        super(Locker);
    }
}

export default LockerService;