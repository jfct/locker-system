import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import '../../models/registerModels';
import BloqModel, { Bloq } from '../bloq.model';

describe('Bloq Model', () => {
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
        await BloqModel.deleteMany({});
    });

    it('should create a new bloq', async () => {
        const bloqData: Bloq = {
            title: 'Test Bloq',
            address: '123 Test Street',
        };

        const bloq = new BloqModel(bloqData);
        await bloq.save();

        const savedBloq = await BloqModel.findOne({ title: 'Test Bloq' });
        expect(savedBloq).toBeTruthy();
        expect(savedBloq?.title).toBe(bloqData.title);
        expect(savedBloq?.address).toBe(bloqData.address);
    });

    it('should not allow duplicate titles', async () => {
        const bloqData: Bloq = {
            title: 'Duplicate Bloq',
            address: '123 Test Street',
        };

        await BloqModel.create(bloqData);
        await expect(BloqModel.create(bloqData)).rejects.toThrow();
    });
});