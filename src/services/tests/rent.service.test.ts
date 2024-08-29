import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { CreateRentDto, UpdateRentDto } from '../../dto/rent.dto';
import { HttpException } from '../../errors/http-exception';
import RentModel from '../../models/rent.model';
import { RentSize, RentStatus } from '../../types/rent';
import RentService from '../rent.service';

describe('Rent Service', () => {
    let mongoServer: MongoMemoryServer;
    let rentService: RentService;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        rentService = new RentService();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await RentModel.deleteMany({});
    });

    describe('create', () => {
        it('should create a new rent', async () => {
            const createRentDto: CreateRentDto = {
                weight: 1
            };

            const createdRent = await rentService.create(createRentDto);

            expect(createdRent).toBeTruthy();
            expect(createdRent.lockerId).toBeNull();
            expect(createdRent.status).toBe(RentStatus.CREATED);
        });

        it('should create a new rent with the correct size', async () => {
            const createRentDtoXS: CreateRentDto = {
                weight: 1
            };
            const createRentDtoS: CreateRentDto = {
                weight: 3
            };
            const createRentDtoM: CreateRentDto = {
                weight: 6
            };
            const createRentDtoL: CreateRentDto = {
                weight: 9
            };
            const createRentDtoXL: CreateRentDto = {
                weight: 11
            };

            const createdRentXS = await rentService.create(createRentDtoXS);
            const createdRentS = await rentService.create(createRentDtoS);
            const createdRentM = await rentService.create(createRentDtoM);
            const createdRentL = await rentService.create(createRentDtoL);
            const createdRentXL = await rentService.create(createRentDtoXL);

            expect(createdRentXS.size).toBe(RentSize.XS);
            expect(createdRentS.size).toBe(RentSize.S);
            expect(createdRentM.size).toBe(RentSize.M);
            expect(createdRentL.size).toBe(RentSize.L);
            expect(createdRentXL.size).toBe(RentSize.XL);
        });

        it('should not create a new rent if size is over the limit', async () => {
            const createRentDto: CreateRentDto = {
                weight: 500
            };
            await expect(rentService.create(createRentDto)).rejects.toThrow(HttpException)
        });

        it('should not create a new rent if size is invalid', async () => {
            const createRentDto: CreateRentDto = {
                weight: -500
            };
            await expect(rentService.create(createRentDto)).rejects.toThrow(HttpException)
        });
    });

    describe('get', () => {
        it('should find a rent by id', async () => {
            const rent = await RentModel.create({
                lockerId: null,
                weight: 1,
                size: RentSize.XS,
                status: RentStatus.CREATED
            });

            const foundRent = await rentService.get(rent.id);

            expect(foundRent).toBeTruthy();
            expect(foundRent?.id).toBe(rent.id);
        });

        it('should return null for non-existent id', async () => {
            const foundRent = await rentService.get('non-existent-id');

            expect(foundRent).toBeNull();
        });
    });

    describe('update', () => {
        it('should update a rent', async () => {
            const rent = await RentModel.create({
                lockerId: null,
                weight: 1,
                status: RentStatus.CREATED,
                size: RentSize.XS
            });

            const updateRentDto: UpdateRentDto = {
                status: RentStatus.WAITING_DROPOFF
            };

            const updatedRent = await rentService.update(rent.id, updateRentDto);

            expect(updatedRent).toBeTruthy();
            expect(updatedRent?.status).toBe(RentStatus.WAITING_DROPOFF);
            expect(updatedRent?.weight).toBe(1);
            expect(updatedRent?.size).toBe(RentSize.XS);
        });
    });
});