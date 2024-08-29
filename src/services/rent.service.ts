import { CreateRentDto, UpdateRentDto } from "../dto/rent.dto";
import { HttpException } from "../errors/http-exception";
import RentModel, { IRent } from "../models/rent.model";
import { RentSize, RentSizeLimits, RentStatus } from "../types/rent";
import BaseService from "./base.service";


class RentService extends BaseService<IRent, CreateRentDto, UpdateRentDto, typeof RentModel> {
    constructor() {
        super(RentModel);
    }

    public async create(value: CreateRentDto): Promise<IRent> {
        return RentModel.create({
            weight: value.weight,
            size: this.sizeClass(value.weight),
            status: RentStatus.CREATED,
            lockerId: null,
            droppedOffAt: null,
            pickedUpAt: null
        })
    }

    // I assumed a max weight 
    private sizeClass(weight: number): RentSize {
        const maxWeight = process.env.MAX_RENT_WEIGHT || "30";
        switch (true) {
            case (weight > 0 && weight <= RentSizeLimits.XS):
                return RentSize.XS;
            case (weight > RentSizeLimits.XS && weight <= RentSizeLimits.S):
                return RentSize.S;
            case (weight > RentSizeLimits.S && weight <= RentSizeLimits.M):
                return RentSize.M;
            case (weight > RentSizeLimits.M && weight <= RentSizeLimits.L):
                return RentSize.L;
            case (weight > RentSizeLimits.L && weight <= parseInt(maxWeight)):
                return RentSize.XL;

            default:
                throw new HttpException(400, "The weight is not within the limit");
        }
    }
}

export default RentService;