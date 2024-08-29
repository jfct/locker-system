import express, { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { globalErrorHandler } from '../../middleware/global-error-handler.middleware';
import BloqModel, { IBloq } from '../../models/bloq.model';
import LockerModel, { ILocker } from '../../models/locker.model';
import '../../models/registerModels';
import RentModel, { IRent } from '../../models/rent.model';
import deliveryRouter from '../../routes/delivery.route';
import { CreateDeliveryParams } from '../../types/delivery';
import { LockerStatus } from '../../types/locker';
import { RentSize, RentStatus } from '../../types/rent';

describe('Delivery Controller', () => {
    let mongoServer: MongoMemoryServer;
    let app: Express;
    let dummyBloq: IBloq;
    let dummyLocker: ILocker;
    let dummyRent: IRent;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        app = express();
        app.use(express.json());
        app.use('/delivery', deliveryRouter);
        app.use(globalErrorHandler);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await BloqModel.deleteMany({});
        await LockerModel.deleteMany({});
        await RentModel.deleteMany({});

        dummyBloq = await BloqModel.create({ title: 'Test Bloq 1', address: 'Address 1' });
        dummyLocker = await LockerModel.create({
            bloqId: dummyBloq.id,
            status: LockerStatus.OPEN,
            isOccupied: false,
        });
        dummyRent = await RentModel.create({
            size: RentSize.XS,
            status: RentStatus.CREATED,
            weight: 1,
        });
    });

    describe('POST /delivery/allocate-rent', () => {
        it('should return 200 and an updated rent if there are lockers available', async () => {
            const deliveryParams: CreateDeliveryParams = {
                bloqId: dummyBloq.id,
                rentId: dummyRent.id
            };

            const response = await request(app)
                .post('/delivery/allocate-rent')
                .send(deliveryParams);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(RentStatus.WAITING_DROPOFF);
        });

        it('should return 400 if no lockers available', async () => {
            await LockerModel.deleteMany({});

            const deliveryParams: CreateDeliveryParams = {
                bloqId: dummyBloq.id,
                rentId: dummyRent.id
            };

            const response = await request(app)
                .post('/delivery/allocate-rent')
                .send(deliveryParams);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /delivery/dropoff-rent/:id', () => {
        beforeEach(async () => {
            await LockerModel.findOneAndUpdate({ id: dummyLocker.id }, { isOccupied: true });
            await RentModel.findOneAndUpdate({ id: dummyRent.id }, {
                lockerId: dummyLocker.id,
                status: RentStatus.WAITING_DROPOFF
            });
        });

        it('should return a 200 if valid request', async () => {

            const response = await request(app).post(`/delivery/dropoff-rent/${dummyRent.id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(RentStatus.WAITING_PICKUP);
        });

        it('should return 400 error for invalid rent id', async () => {
            const response = await request(app).post('/delivery/dropoff-rent/invalidid');
            expect(response.status).toBe(400);
        });
    });

    describe('POST /delivery/pickup-rent/:id', () => {
        beforeEach(async () => {
            await LockerModel.findOneAndUpdate({ id: dummyLocker.id }, {
                status: LockerStatus.CLOSED,
                isOccupied: true
            });
            await RentModel.findOneAndUpdate({ id: dummyRent.id }, {
                lockerId: dummyLocker.id,
                status: RentStatus.WAITING_PICKUP
            });
        });

        it('should return a 200 if valid request', async () => {
            const response = await request(app).post(`/delivery/pickup-rent/${dummyRent.id}`);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(RentStatus.DELIVERED);
        });

        it('should return 400 error for invalid rent id', async () => {
            const response = await request(app).post('/delivery/pickup-rent/invalidid');
            expect(response.status).toBe(400);
        });
    });
});