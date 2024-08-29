import mongoose, { Document, Model } from "mongoose";

/**
 * Generic class for the classic CRUD service
 * 
 * We use T as the IGeneric interface, 
 * the Dto is usually a partial of the generic interface
 * THe U is the model of the service
 */
abstract class BaseService<T extends Document, Dto extends Partial<T>, UpdateDto extends Partial<T>> {
    constructor(private model: Model<T>) { }

    public async create(value: Dto): Promise<T> {
        const newObj = new this.model(value);
        return newObj.save();
    }

    public async get(id: string): Promise<T | null> {
        return this.model.findOne({ id }).exec();
    }

    public async update(id: string, payload: Partial<UpdateDto>, session?: mongoose.ClientSession): Promise<T | null> {
        return this.model
            .findOneAndUpdate({ id }, payload, { new: true, session })
            .lean();
    }

    public async delete(id: string, session?: mongoose.ClientSession): Promise<T | null> {
        return this.model
            .deleteOne({ id }, { new: true, session })
            .lean();
    }
}

export default BaseService;