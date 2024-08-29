import { CreateBloqDto, UpdateBloqDto } from "../dto/bloq.dto";
import BloqModel, { Bloq, IBloq, IBloqPopulated } from "../models/bloq.model";
import BaseService from "./base.service";


class BloqService extends BaseService<IBloq, CreateBloqDto, UpdateBloqDto> {
    constructor() {
        super(BloqModel);
    }

    public async get(id: string): Promise<IBloqPopulated | null> {
        return BloqModel.findOne<IBloqPopulated>({ id }).populate("lockers").exec();
    }

    public async getAll(): Promise<Bloq[] | null> {
        return BloqModel.find<IBloqPopulated>({});
    }

}

export default BloqService;