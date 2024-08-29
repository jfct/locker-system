import { HttpException } from "../errors/http-exception";
import { IRent } from "../models/rent.model";
import { LockerStatus } from "../types/locker";
import { RentStatus } from "../types/rent";
import BloqService from "./bloq.service";
import LockerService from "./locker.service";
import RentService from "./rent.service";

interface VerifyLockerAndRentStatusParams {
    lockerStatus: LockerStatus;
    isOccupied: boolean;
    rentStatus: RentStatus
}

/**
 * TODO: Most of the endpoints in this class should be done in a transaction but for that 
 * to work in mongo we would have to have replicas or a sharded cluster, so for that reason we skip the transaction
 * at this stage
 */
class DeliveryService {
    constructor(
        private bloqService: BloqService,
        private lockerService: LockerService,
        private rentService: RentService
    ) { }

    /**
     * 
     * Picks up a rent and updates the locker
     * 
     * In this case the locker will go into the OPEN and non occupied state since the user
     * will pickup the rent/parcel
     * 
     */
    public async pickupRent(rentId: string): Promise<IRent | null> {
        // Validate rent & rent status
        const rent = await this.rentService.get(rentId);
        if (!rent) {
            throw new HttpException(400, "No rent found for that Id")
        }
        if (rent.status !== RentStatus.WAITING_PICKUP) {
            throw new HttpException(400, "This rent is not waiting pickup");
        }
        if (!rent.lockerId) {
            throw new HttpException(400, "No locker assigned for this rent");
        }

        this.verifyLockerAndRentStatus({
            lockerStatus: LockerStatus.OPEN,
            isOccupied: false,
            rentStatus: RentStatus.DELIVERED
        })

        await this.lockerService.update(rent.lockerId, {
            status: LockerStatus.OPEN,
            isOccupied: false,
        })

        return this.rentService.update(rentId, {
            droppedOffAt: new Date(),
            status: RentStatus.DELIVERED
        })
    }

    /**
     * 
     * Drops off a rent/parcel
     * 
     * In this case the locker will go into a CLOSED and OCCUPIED state, this is due to the user
     * dropping off the parcel at the specified locker
     * 
     */
    public async dropOffRent(rentId: string): Promise<IRent | null> {
        // Validate rent & rent status
        const rent = await this.rentService.get(rentId);
        if (!rent) {
            throw new HttpException(400, "No rent found for that Id")
        }
        if (rent.status !== RentStatus.WAITING_DROPOFF) {
            throw new HttpException(400, "This rent is not waiting dropoff");
        }
        if (!rent.lockerId) {
            throw new HttpException(400, "No locker assigned for this rent");
        }

        this.verifyLockerAndRentStatus({
            lockerStatus: LockerStatus.CLOSED,
            isOccupied: true,
            rentStatus: RentStatus.WAITING_PICKUP
        })

        await this.lockerService.update(rent.lockerId, {
            status: LockerStatus.CLOSED,
            isOccupied: true,
        })

        return this.rentService.update(rentId, {
            droppedOffAt: new Date(),
            status: RentStatus.WAITING_PICKUP
        })
    }

    /**
     * Allocates a rent/parcel to an open locker, if there are any open lockers
     * 
     * The locker will have to be in an OPEN and non OCCUPIED state
     * 
     */
    public async allocateRent(bloqId: string, rentId: string): Promise<IRent | null> {
        // Validate bloqId & rent
        const rent = await this.rentService.get(rentId);
        if (!rent) {
            throw new HttpException(400, "No rent found for that Id")
        }
        if (rent.status !== RentStatus.CREATED) {
            throw new HttpException(400, "This rent has already been allocated")
        }

        const bloq = await this.bloqService.get(bloqId);
        if (!bloq) {
            throw new HttpException(400, "No bloq found for that Id")
        }

        const openLockers = await this.lockerService.checkOpenLockers(bloqId);

        if (!openLockers || openLockers.length <= 0) {
            throw new HttpException(400, "No available lockers");
        }

        // For now we will just choose the first one of the available
        // One option could be ge
        const locker = openLockers[0];

        this.verifyLockerAndRentStatus({
            lockerStatus: LockerStatus.OPEN,
            isOccupied: true,
            rentStatus: RentStatus.WAITING_DROPOFF
        })

        // We always update first the rent and only after the locker
        const updatedRent = await this.rentService.update(rentId, {
            status: RentStatus.WAITING_DROPOFF,
            lockerId: locker.id
        })

        await this.lockerService.update(locker.id, {
            status: LockerStatus.OPEN,
            isOccupied: true
        })

        return updatedRent;
    }


    /**
     * 
     * Verifies both the locker status, the occupation and the rent status and returns true 
     * if it's valid
     * 
     * Should call this to make sure we are doing a valid operation
     * 
     */
    public verifyLockerAndRentStatus({
        lockerStatus,
        isOccupied,
        rentStatus
    }: VerifyLockerAndRentStatusParams): boolean {
        // Open + Not Occupied = Open
        // If we are trying to "OPEN" the locker without the rent status being delivered
        if (
            (rentStatus !== RentStatus.DELIVERED)
            && (lockerStatus === LockerStatus.OPEN && !isOccupied)
        ) {
            throw new HttpException(400, "This locker has a rent yet to be picked up or delivered")
        }

        // Open + Occupied = Waiting dropoff
        // If we are trying to mark the locker as "OCCUPIED" without the rent being waiting for dropoff signal
        if (
            rentStatus !== RentStatus.WAITING_DROPOFF
            && (lockerStatus === LockerStatus.OPEN && isOccupied)
        ) {
            throw new HttpException(400, "The locker does not have a rent that is waiting for a dropoff")
        }

        // Closed + Occupied = Waiting pickup
        // If we are trying to "CLOSE" and OCCUPY the locker but the rent is not on the PICKUP status
        if (
            rentStatus != RentStatus.WAITING_PICKUP
            && (lockerStatus === LockerStatus.CLOSED && isOccupied)
        ) {
            throw new HttpException(400, "The locker cannot be closed and occupied without a rent ready for pickup")
        }

        // For now I assume this is not possible
        // Closed + Not Occupied = Impossible/Maintenance/Reservation? 
        if (lockerStatus === LockerStatus.CLOSED && !isOccupied) {
            throw new HttpException(400, "The locker cannot be closed and not occupied")
        }

        return true;
    }
}

export default DeliveryService;