import { CreateBloqDto } from "../dto/bloq.dto";
import Bloq, { IBloq } from "../models/bloq.model";
import BaseService from "./base.service";


class BloqService extends BaseService<IBloq, CreateBloqDto, typeof Bloq> {
    constructor() {
        super(Bloq);
    }
}

export default BloqService;