import { CreateLockerDto } from "../dto/locker.dto";
import LockerModel, { ILocker } from "../models/locker.model";
import BaseService from "./base.service";


class LockerService extends BaseService<ILocker, CreateLockerDto, typeof LockerModel> {
    constructor() {
        super(LockerModel);
    }
}

export default LockerService;