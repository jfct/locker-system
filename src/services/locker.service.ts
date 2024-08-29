import { CreateLockerDto, UpdateLockerDto } from "../dto/locker.dto";
import LockerModel, { ILocker } from "../models/locker.model";
import { LockerStatus } from "../types/locker";
import { RentStatus } from "../types/rent";
import BaseService from "./base.service";


class LockerService extends BaseService<ILocker, CreateLockerDto, UpdateLockerDto, typeof LockerModel> {
    constructor() {
        super(LockerModel);
    }

    // Look for open lockers in a specific bloq
    public async checkOpenLockers(bloqId: string): Promise<ILocker[] | null> {
        // Validate if the bloq exists
        const lockers = await LockerModel.aggregate(
            [
                {
                    $match: { status: LockerStatus.OPEN, isOccupied: false, bloqId },
                }, {
                    $lookup: {
                        from: 'rents',
                        localField: '_id',
                        foreignField: 'lockerId',
                        as: 'rents'
                    }
                }, {
                    $match: {
                        $or: [
                            { rents: { $size: 0 } },
                            { 'rents.status': { $ne: [RentStatus.WAITING_DROPOFF, RentStatus.WAITING_PICKUP] } }
                        ]
                        // Sort by updatedAt so if we have to pick a locker, we will pick the one that 
                        // hasn't been updated in a while
                    }
                }, {
                    $sort: { updatedAt: -1 }
                }
            ]
        );

        return lockers;
    }


}

export default LockerService;