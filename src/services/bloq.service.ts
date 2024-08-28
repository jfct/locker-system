import { CreateBloqDto } from "../dto/bloq.dto";
import BloqModel, { IBloq } from "../models/bloq.model";
import BaseService from "./base.service";


class BloqService extends BaseService<IBloq, CreateBloqDto, typeof BloqModel> {
    constructor() {
        super(BloqModel);
    }
}

export default BloqService;