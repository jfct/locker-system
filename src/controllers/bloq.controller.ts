import { CreateBloqDto } from "../dto/bloq.dto";
import BloqService from "../services/bloq.service";
import BaseController from "./base.controller";


class BloqController extends BaseController<CreateBloqDto> {
    protected service: BloqService;

    constructor() {
        super();
        this.service = new BloqService();
    }
}

export default BloqController;