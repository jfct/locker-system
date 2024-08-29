import express, { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { CreateBloqDto } from '../../dto/bloq.dto';
import { globalErrorHandler } from '../../middleware/global-error-handler.middleware';
import BloqModel from '../../models/bloq.model';
import '../../models/registerModels';
import bloqRouter from '../../routes/bloq.route';

describe('Bloq Controller', () => {
    let mongoServer: MongoMemoryServer;
    let app: Express;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        app = express();
        app.use(express.json());
        app.use('/bloq', bloqRouter);
        app.use(globalErrorHandler);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await BloqModel.deleteMany({});
    });

    describe('GET /bloq', () => {
        it('should return all bloq', async () => {
            await BloqModel.create({ title: 'Test Bloq 1', address: 'Address 1' });
            await BloqModel.create({ title: 'Test Bloq 2', address: 'Address 2' });

            const response = await request(app).get('/bloq');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].title).toBe('Test Bloq 1');
            expect(response.body[1].title).toBe('Test Bloq 2');
        });
    });

    describe('GET /bloq/:id', () => {
        it('should return a bloq by id', async () => {
            const bloq = await BloqModel.create({ title: 'Test Bloq', address: 'Test Address' });

            const response = await request(app).get(`/bloq/${bloq.id}`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Bloq');
            expect(response.body.address).toBe('Test Address');
        });

        it('should return 400 error for invalid bloq id', async () => {
            const response = await request(app).get('/bloq/invalidid');
            expect(response.status).toBe(400);
        });
    });

    describe('POST /bloq', () => {
        it('should create a new bloq', async () => {
            const newBloq: CreateBloqDto = { title: 'New Bloq', address: 'New Address' };

            const response = await request(app)
                .post('/bloq/')
                .send(newBloq);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(newBloq.title);
            expect(response.body.address).toBe(newBloq.address);

            const savedBloq = await BloqModel.findOne({ title: 'New Bloq' });
            expect(savedBloq).toBeTruthy();
        });

        it('should return 400 for invalid input', async () => {
            const invalidBloq = { title: '', address: '' };

            const response = await request(app)
                .post('/bloq')
                .send(invalidBloq);

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /bloq/:id', () => {
        it('should update a bloq', async () => {
            const bloq = await BloqModel.create({ title: 'Old Title', address: 'Old Address' });
            const updatedData = { title: 'Updated Title', address: 'Updated Address' };

            const response = await request(app)
                .put(`/bloq/${bloq.id}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
            expect(response.body.address).toBe(updatedData.address);

            const updatedBloq = await BloqModel.findOne({ id: bloq.id });
            expect(updatedBloq?.title).toBe(updatedData.title);
            expect(updatedBloq?.address).toBe(updatedData.address);
        });
    });

    describe('DELETE /bloq/:id', () => {
        it('should delete a bloq', async () => {
            const bloq = await BloqModel.create({ title: 'To Be Deleted', address: 'Delete Address' });

            const response = await request(app).delete(`/bloq/${bloq.id}`);

            expect(response.status).toBe(200);

            const deletedBloq = await BloqModel.findOne({ id: bloq.id });
            expect(deletedBloq).toBeNull();
        });
    });
});