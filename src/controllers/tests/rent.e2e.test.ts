import express, { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { CreateRentDto } from '../../dto/rent.dto';
import { globalErrorHandler } from '../../middleware/global-error-handler.middleware';
import '../../models/registerModels';
import RentModel from '../../models/rent.model';
import rentRouter from '../../routes/rent.route';
import { RentSize, RentStatus } from '../../types/rent';

describe('Locker Controller', () => {
    let mongoServer: MongoMemoryServer;
    let app: Express;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        app = express();
        app.use(express.json());
        app.use('/rent', rentRouter);
        app.use(globalErrorHandler);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await RentModel.deleteMany({});
    });

    describe('GET /rent/:id', () => {
        it('should get a locker by id', async () => {
            const rent = await RentModel.create({
                size: RentSize.L,
                status: RentStatus.CREATED,
                weight: 1,
            });

            const response = await request(app)
                .get(`/rent/${rent.id}`)

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(rent.id);
            expect(response.body.size).toBe(rent.size);
        });

        it('should return 400 error for invalid rent id', async () => {
            await request(app)
                .get('/rent/invalidid')
                .expect(400);
        });
    });

    describe('POST /rent', () => {
        it('should create a new rent', async () => {
            const createRentDto: CreateRentDto = {
                weight: 1,
            };

            const response = await request(app)
                .post('/rent')
                .send(createRentDto)

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.weight).toBe(createRentDto.weight);
            expect(response.body.size).toBeDefined()
        });
    });

    describe('PUT /rent/:id', () => {
        it('should update a locker', async () => {
            const rent = await RentModel.create({
                size: RentSize.L,
                status: RentStatus.CREATED,
                weight: 1,
            });

            const updateData = {
                status: RentStatus.WAITING_DROPOFF,
            };

            const response = await request(app)
                .put(`/rent/${rent.id}`)
                .send(updateData)

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(updateData.status);
        });
    });
});