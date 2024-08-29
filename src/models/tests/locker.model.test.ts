import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { LockerStatus } from '../../types/locker';
import LockerModel, { ILocker, Locker } from '../locker.model';


describe('Locker Model', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await LockerModel.deleteMany({});
    });

    it('should create a new Locker', async () => {
        const lockerData: Locker = {
            bloqId: 'test-bloq-id',
            status: LockerStatus.OPEN,
            isOccupied: false,
        };

        const locker = new LockerModel(lockerData);
        await locker.save();

        const savedLocker = await LockerModel.findOne({ bloqId: 'test-bloq-id' });
        expect(savedLocker).toBeTruthy();
        expect(savedLocker?.bloqId).toBe(lockerData.bloqId);
        expect(savedLocker?.status).toBe(lockerData.status);
        expect(savedLocker?.isOccupied).toBe(lockerData.isOccupied);
    });

    it('should not allow empty bloqId', async () => {
        const lockerData: Partial<Locker> = {
            status: LockerStatus.OPEN,
            isOccupied: false,
        };

        const locker = new LockerModel(lockerData);
        await expect(locker.save()).rejects.toThrow();
    });

    it('should not allow invalid status', async () => {
        const lockerData: Partial<ILocker> = {
            bloqId: 'test-bloq-id',
            status: 'INVALID_STATUS' as LockerStatus,
            isOccupied: false,
        };

        const locker = new LockerModel(lockerData);
        await expect(locker.save()).rejects.toThrow();
    });

    it('should set default values', async () => {
        const lockerData: Partial<ILocker> = {
            bloqId: 'test-bloq-id',
            status: LockerStatus.OPEN,
        };

        const locker = new LockerModel(lockerData);
        await locker.save();

        expect(locker.id).toBeTruthy();
        expect(locker.isOccupied).toBe(false);
        expect(locker.createdAt).toBeTruthy();
        expect(locker.updatedAt).toBeTruthy();
    });
});