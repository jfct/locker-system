import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateLockerDto } from '../../dto/locker.dto';
import LockerModel from '../../models/locker.model';
import { LockerStatus } from '../../types/locker';
import LockerService from '../locker.service';

describe('Locker Service', () => {
    let mongoServer: MongoMemoryServer;
    let lockerService: LockerService;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        lockerService = new LockerService();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await LockerModel.deleteMany({});
    });

    describe('create', () => {
        it('should create a new locker', async () => {
            const createLockerDto: CreateLockerDto = {
                bloqId: uuidv4(),
            };

            const createdLocker = await lockerService.create(createLockerDto);

            expect(createdLocker).toBeTruthy();
            expect(createdLocker.bloqId).toBe(createLockerDto.bloqId);
            expect(createdLocker.status).toBe(LockerStatus.OPEN);
            expect(createdLocker.isOccupied).toBe(false);
        });
    });

    describe('get', () => {
        it('should find a locker by id', async () => {
            const locker = await LockerModel.create({
                bloqId: uuidv4(),
                status: LockerStatus.OPEN,
            });

            const foundLocker = await lockerService.get(locker.id);

            expect(foundLocker).toBeTruthy();
            expect(foundLocker?.id).toBe(locker.id);
        });

        it('should return null for non-existent id', async () => {
            const foundLocker = await lockerService.get('non-existent-id');

            expect(foundLocker).toBeNull();
        });
    });

    describe('checkOpenLockers', () => {
        it('should return open lockers for a specific bloq', async () => {
            const bloqId = uuidv4();
            await LockerModel.create([
                { bloqId, status: LockerStatus.OPEN, isOccupied: false },
                { bloqId, status: LockerStatus.CLOSED, isOccupied: true },
                { bloqId, status: LockerStatus.OPEN, isOccupied: false },
                { bloqId: 'other-bloq-id', status: LockerStatus.OPEN, isOccupied: false },
            ]);

            const openLockers = await lockerService.checkOpenLockers(bloqId);

            expect(openLockers).toHaveLength(2);
            openLockers?.forEach(locker => {
                expect(locker.bloqId).toBe(bloqId);
                expect(locker.status).toBe(LockerStatus.OPEN);
                expect(locker.isOccupied).toBe(false);
            });
        });


        it('should return no lockers if there are none available', async () => {
            const bloqId = uuidv4();
            await LockerModel.create([
                { bloqId, status: LockerStatus.OPEN, isOccupied: true },
                { bloqId, status: LockerStatus.CLOSED, isOccupied: true },
                { bloqId, status: LockerStatus.CLOSED, isOccupied: false },
            ]);

            const openLockers = await lockerService.checkOpenLockers(bloqId);

            expect(openLockers).toHaveLength(0);
        });

        it('should return no lockers if there are none', async () => {
            const bloqId = uuidv4();
            const openLockers = await lockerService.checkOpenLockers(bloqId);

            expect(openLockers).toHaveLength(0);
        });
    });
});