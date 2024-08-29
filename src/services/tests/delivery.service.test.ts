import { v4 as uuidv4 } from 'uuid';
import { HttpException } from "../../errors/http-exception";
import { IBloqPopulated } from '../../models/bloq.model';
import { ILocker } from '../../models/locker.model';
import { IRent } from "../../models/rent.model";
import { LockerStatus } from "../../types/locker";
import { RentSize, RentStatus } from "../../types/rent";
import BloqService from "../bloq.service";
import DeliveryService from "../delivery.service";
import LockerService from "../locker.service";
import RentService from "../rent.service";

jest.mock('../bloq.service')
jest.mock('../locker.service');
jest.mock('../rent.service');

describe('DeliveryService', () => {
    let deliveryService: DeliveryService;
    let mockBloqService: jest.Mocked<BloqService>;
    let mockLockerService: jest.Mocked<LockerService>;
    let mockRentService: jest.Mocked<RentService>;

    beforeEach(() => {
        mockBloqService = new BloqService() as jest.Mocked<BloqService>;
        mockLockerService = new LockerService() as jest.Mocked<LockerService>;
        mockRentService = new RentService() as jest.Mocked<RentService>;

        deliveryService = new DeliveryService(
            mockBloqService,
            mockLockerService,
            mockRentService
        );
    });

    describe('pickupRent', () => {
        it('should successfully pickup a rent and update the locker', async () => {
            const mockRent: IRent = {
                id: uuidv4(),
                status: RentStatus.WAITING_PICKUP,
                lockerId: uuidv4(),
                weight: 5,
                size: RentSize.M,
                createdAt: new Date(),
                updatedAt: new Date()
            } as IRent;
            mockRentService.get.mockResolvedValue(mockRent);
            mockLockerService.update.mockResolvedValue({} as ILocker);
            mockRentService.update.mockResolvedValue({ ...mockRent, status: RentStatus.DELIVERED } as IRent);

            const result = await deliveryService.pickupRent(mockRent.id);

            expect(result?.status).toEqual(RentStatus.DELIVERED)
            expect(result?.pickedUpAt).toBeDefined

            expect(mockLockerService.update).toHaveBeenCalledWith(mockRent.lockerId, {
                status: LockerStatus.OPEN,
                isOccupied: false,
            });
        });

        it('should throw an error if rent is not found', async () => {
            mockRentService.get.mockResolvedValue(null);

            await expect(deliveryService.pickupRent('nonexistent')).rejects.toThrow(HttpException);
        });

        it('should throw an error if rent has no locker assigned', async () => {
            const mockRent: IRent = {
                id: uuidv4(),
                status: RentStatus.WAITING_PICKUP,
                weight: 5,
                size: RentSize.M
            } as IRent;

            mockRentService.get.mockResolvedValue(mockRent);

            await expect(deliveryService.pickupRent(mockRent.id)).rejects.toThrow(HttpException);
        });

        it('should throw an error if rent status is not WAITING_PICKUP', async () => {
            mockRentService.get.mockResolvedValue({ status: RentStatus.CREATED } as any);

            await expect(deliveryService.pickupRent('rent1')).rejects.toThrow(HttpException);
        });
    });

    describe('dropOffRent', () => {
        it('should successfully dropoff a rent and update locker', async () => {
            const mockRent: IRent = {
                id: uuidv4(),
                status: RentStatus.WAITING_DROPOFF,
                lockerId: uuidv4(),
                weight: 5,
                size: RentSize.M,
                createdAt: new Date(),
                updatedAt: new Date()
            } as IRent;
            mockRentService.get.mockResolvedValue(mockRent);
            mockLockerService.update.mockResolvedValue({} as any);
            mockRentService.update.mockResolvedValue({ ...mockRent, status: RentStatus.WAITING_PICKUP } as any);

            const result = await deliveryService.dropOffRent(mockRent.id);

            expect(result?.status).toEqual(RentStatus.WAITING_PICKUP)
            expect(result?.droppedOffAt).toBeDefined

            expect(mockLockerService.update).toHaveBeenCalledWith(mockRent.lockerId, {
                status: LockerStatus.CLOSED,
                isOccupied: true,
            });
        });

        it('should throw an error if rent has no locket associated', async () => {
            const mockRent: IRent = {
                id: uuidv4(),
                status: RentStatus.WAITING_DROPOFF,
                weight: 5,
                size: RentSize.M
            } as IRent;

            mockRentService.get.mockResolvedValue(mockRent);

            await expect(deliveryService.dropOffRent(mockRent.id)).rejects.toThrow(HttpException);
        });

        it('should throw an error if rent is not found', async () => {
            mockRentService.get.mockResolvedValue(null);

            await expect(deliveryService.dropOffRent('nonexistent')).rejects.toThrow(HttpException);
        });

        it('should throw an error if rent status is not WAITING_DROPOFF', async () => {
            mockRentService.get.mockResolvedValue({ status: RentStatus.CREATED } as any);

            await expect(deliveryService.dropOffRent('rent1')).rejects.toThrow(HttpException);
        });
    });

    describe('allocateRent', () => {
        it('should successfully allocate a rent and update the locker', async () => {
            const mockRent: IRent = {
                id: uuidv4(),
                status: RentStatus.CREATED,
                weight: 5,
                size: RentSize.M,
                createdAt: new Date(),
                updatedAt: new Date()
            } as IRent;

            const mockBloq: IBloqPopulated = {
                id: uuidv4(),
                title: 'mockBloq',
                address: 'mock address',
            } as IBloqPopulated;

            const mockLocker: ILocker = {
                id: uuidv4(),
                bloqId: mockBloq.id,
                status: LockerStatus.OPEN,
            } as ILocker;

            mockRentService.get.mockResolvedValue(mockRent);
            mockBloqService.get.mockResolvedValue(mockBloq);
            mockLockerService.checkOpenLockers.mockResolvedValue([mockLocker]);
            mockLockerService.update.mockResolvedValue({} as any);
            mockRentService.update.mockResolvedValue({ ...mockRent, status: RentStatus.WAITING_DROPOFF, lockerId: 'locker1' } as any);

            const result = await deliveryService.allocateRent(mockBloq.id, mockRent.id);

            expect(result).toEqual(expect.objectContaining({
                status: RentStatus.WAITING_DROPOFF,
                lockerId: 'locker1',
            }));
            expect(mockLockerService.update).toHaveBeenCalledWith(mockLocker.id, {
                status: LockerStatus.OPEN,
                isOccupied: true,
            });
        });

        it('should throw an error if rent is not found', async () => {
            mockRentService.get.mockResolvedValue(null);

            await expect(deliveryService.allocateRent('bloq1', 'nonexistent')).rejects.toThrow(HttpException);
        });

        it('should throw an error if bloq is not found', async () => {
            mockRentService.get.mockResolvedValue({ status: RentStatus.CREATED } as IRent);
            mockBloqService.get.mockResolvedValue(null);

            await expect(deliveryService.allocateRent('nonexistent', 'rent1')).rejects.toThrow(HttpException);
        });

        it('should throw an error if no open lockers are available', async () => {
            mockRentService.get.mockResolvedValue({ status: RentStatus.CREATED } as any);
            mockBloqService.get.mockResolvedValue({} as IBloqPopulated);
            mockLockerService.checkOpenLockers.mockResolvedValue([]);

            await expect(deliveryService.allocateRent('bloq1', 'rent1')).rejects.toThrow(HttpException);
        });
    });
});