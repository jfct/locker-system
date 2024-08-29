import BloqModel from "../../models/bloq.model";
import BloqService from "../bloq.service";

jest.mock('../../models/bloq.model');

describe('BloqService', () => {
    let bloqService: BloqService;

    beforeEach(() => {
        bloqService = new BloqService();
    });

    describe('get', () => {
        it('should return a populated bloq', async () => {
            const mockBloq = { id: '1', title: 'Bloq 1', address: 'Address 1', lockers: [] };
            (BloqModel.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockBloq),
                }),
            });

            const result = await bloqService.get('1');

            expect(result).toEqual(mockBloq);
            expect(BloqModel.findOne).toHaveBeenCalledWith({ id: '1' });
        });
    });

    describe('getAll', () => {
        it('should return all bloqs', async () => {
            const mockBloqs = [
                { id: '1', title: 'Bloq 1', address: 'Address 1' },
                { id: '2', title: 'Bloq 2', address: 'Address 2' },
            ];
            (BloqModel.find as jest.Mock).mockResolvedValue(mockBloqs);

            const result = await bloqService.getAll();

            expect(result).toEqual(mockBloqs);
            expect(BloqModel.find).toHaveBeenCalledWith({});
        });
    });
});