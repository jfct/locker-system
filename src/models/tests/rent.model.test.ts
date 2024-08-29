import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { LockerStatus } from '../../types/locker';
import { RentSize, RentStatus } from '../../types/rent';
import BloqModel, { Bloq, IBloq } from '../bloq.model';
import LockerModel, { ILocker, Locker } from '../locker.model';
import RentModel, { Rent } from '../rent.model';

describe('Rent Model', () => {
    let mongoServer: MongoMemoryServer;
    let dummyBloq: IBloq;
    let dummyLocker: ILocker;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        // Create a dummy bloq and locker
        const bloqData: Bloq = {
            title: 'Test Bloq',
            address: '123 Test Street',
        };
        const bloq = new BloqModel(bloqData);
        dummyBloq = await bloq.save();

        const lockerData: Locker = {
            bloqId: bloq.id,
            isOccupied: false,
            status: LockerStatus.OPEN
        }
        const locker = new LockerModel(lockerData);
        dummyLocker = await locker.save();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await BloqModel.deleteMany({});
        await LockerModel.deleteMany({});
    });

    it('should create a new rent without a locker', async () => {
        const rentData: Rent = {
            size: RentSize.L,
            status: RentStatus.CREATED,
            weight: 1,
        };
        const rent = new RentModel(rentData);
        await rent.save();

        const savedRent = await RentModel.findOne({ id: rent.id });
        expect(savedRent).toBeTruthy();
        expect(savedRent?.size).toBe(RentSize.L);
        expect(savedRent?.status).toBe(RentStatus.CREATED);
        expect(savedRent?.weight).toBe(1);
        expect(savedRent?.lockerId).toBeUndefined();
    });

    it('should create a new rent with a locker', async () => {
        const rentData: Rent = {
            size: RentSize.L,
            status: RentStatus.CREATED,
            weight: 1,
        };
        const rent = new RentModel(rentData);
        await rent.save();

        const savedRent = await RentModel.findOne({ id: rent.id });
        expect(savedRent).toBeTruthy();
        expect(savedRent?.size).toBe(RentSize.L);
        expect(savedRent?.status).toBe(RentStatus.CREATED);
        expect(savedRent?.weight).toBe(1);
        expect(savedRent?.lockerId).toBeUndefined();
    });

    it('should not allow invalid status', async () => {
        const rentData: Rent = {
            size: RentSize.L,
            status: "INVALID_STATUS" as RentStatus,
            weight: 1,
        };
        const rent = new RentModel(rentData);
        await expect(rent.save()).rejects.toThrow()
    })

    it('should not allow invalid size', async () => {
        const rentData: Rent = {
            size: "INVALID_SIZE" as RentSize,
            status: RentStatus.CREATED,
            weight: 1,
        };
        const rent = new RentModel(rentData);
        await expect(rent.save()).rejects.toThrow()
    })
});