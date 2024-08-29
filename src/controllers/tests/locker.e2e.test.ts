import express, { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { CreateLockerDto } from '../../dto/locker.dto';
import { globalErrorHandler } from '../../middleware/global-error-handler.middleware';
import LockerModel from '../../models/locker.model';
import '../../models/registerModels';
import lockerRouter from '../../routes/locker.route';
import { LockerStatus } from '../../types/locker';

describe('Locker Controller', () => {
    let mongoServer: MongoMemoryServer;
    let app: Express;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        app = express();
        app.use(express.json());
        app.use('/locker', lockerRouter);
        app.use(globalErrorHandler);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await LockerModel.deleteMany({});
    });

    describe('GET /locker/:id', () => {
        it('should get a locker by id', async () => {
            const locker = await LockerModel.create({
                bloqId: uuidv4(),
                status: LockerStatus.OPEN,
            });

            const response = await request(app)
                .get(`/locker/${locker.id}`)

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(locker.id);
            expect(response.body.bloqId).toBe(locker.bloqId);
        });

        it('should return 400 error for invalid bloq id', async () => {
            await request(app)
                .get('/locker/invalidid')
                .expect(400);
        });
    });

    describe('POST /locker', () => {
        it('should create a new locker', async () => {
            const createLockerDto: CreateLockerDto = {
                bloqId: uuidv4(),
                status: LockerStatus.OPEN,
                isOccupied: false
            };

            const response = await request(app)
                .post('/locker')
                .send(createLockerDto)

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.bloqId).toBe(createLockerDto.bloqId);
            expect(response.body.status).toBe(createLockerDto.status);
        });
    });

    describe('PUT /locker/:id', () => {
        it('should update a locker', async () => {
            const locker = await LockerModel.create({
                bloqId: 'test-bloq-id',
                status: LockerStatus.OPEN,
            });

            const updateData = {
                status: LockerStatus.CLOSED,
                isOccupied: true,
            };

            const response = await request(app)
                .put(`/locker/${locker.id}`)
                .send(updateData)

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(updateData.status);
            expect(response.body.isOccupied).toBe(updateData.isOccupied);
        });
    });
});